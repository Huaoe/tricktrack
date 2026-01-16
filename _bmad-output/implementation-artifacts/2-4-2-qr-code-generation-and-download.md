# Story 2.4.2: QR Code Generation and Download

Status: ready-for-dev

## Story

As a **user**,
I want **to generate and download a QR code of my wallet address**,
So that **I can easily share my address in person**.

## Acceptance Criteria

1. **Given** I am viewing my wallet address
   **When** I click "QR Code" button
   **Then** a QR code modal opens displaying my wallet address
   **And** I can download the QR code as a PNG file
   **And** the QR code is scannable

## Tasks / Subtasks

- [ ] Install QR code dependencies (AC: 1)
  - [ ] Install `qrcode.react` for QR code generation
  - [ ] Install `@types/qrcode.react` for TypeScript support
  - [ ] Verify QR code rendering
- [ ] Create QR code component (AC: 1)
  - [ ] Create `src/components/wallet/WalletQRCode.tsx`
  - [ ] Generate QR code from wallet address
  - [ ] Style QR code with branding
  - [ ] Add modal/dialog wrapper
- [ ] Implement download functionality (AC: 1)
  - [ ] Convert SVG QR code to PNG
  - [ ] Create download button
  - [ ] Generate filename with address prefix
  - [ ] Trigger browser download
- [ ] Add QR code trigger to address display (AC: 1)
  - [ ] Update `WalletAddressDisplay` component
  - [ ] Add "QR Code" button
  - [ ] Handle modal open/close state
  - [ ] Add QR code icon
- [ ] Verify QR code functionality
  - [ ] Test QR code generates correctly
  - [ ] Verify QR code is scannable
  - [ ] Test download functionality
  - [ ] Confirm PNG file downloads correctly
  - [ ] Test on mobile devices

## Dev Notes

### QR Code Component

**src/components/wallet/WalletQRCode.tsx:**
```typescript
'use client';

import { QRCodeSVG } from 'qrcode.react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, Button } from '@tricktrack/ui';
import { Download } from 'lucide-react';

interface WalletQRCodeProps {
  address: string;
  onClose: () => void;
}

export const WalletQRCode = ({ address, onClose }: WalletQRCodeProps) => {
  const handleDownload = () => {
    const svg = document.getElementById('wallet-qr-code');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `tricktrack-wallet-${address.slice(0, 8)}.png`;
        link.click();
        URL.revokeObjectURL(url);
      });
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Wallet QR Code</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="bg-white p-4 rounded-lg">
            <QRCodeSVG
              id="wallet-qr-code"
              value={address}
              size={256}
              level="H"
              includeMargin={true}
            />
          </div>

          <p className="text-sm text-center text-muted-foreground font-mono break-all px-4">
            {address}
          </p>

          <Button
            onClick={handleDownload}
            variant="outline"
            className="min-h-[44px] gap-2"
          >
            <Download className="h-4 w-4" />
            Download QR Code
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
```

### Updated Address Display Component

**Update src/components/wallet/WalletAddressDisplay.tsx:**
```typescript
'use client';

import { useState } from 'react';
import { Button, Badge } from '@tricktrack/ui';
import { Copy, ExternalLink, Check, QrCode } from 'lucide-react';
import { toast } from 'sonner';
import { truncateAddress, getPolygonScanUrl } from '@/lib/utils/address';
import { WalletQRCode } from './WalletQRCode';

interface WalletAddressDisplayProps {
  address: string;
  walletType: 'in-app' | 'external';
  network?: 'mainnet' | 'testnet';
}

export const WalletAddressDisplay = ({ 
  address, 
  walletType,
  network = 'mainnet' 
}: WalletAddressDisplayProps) => {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      toast.success('Address copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      fallbackCopy(address);
    }
  };

  const fallbackCopy = (text: string) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      toast.success('Address copied!');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy address');
    }
    document.body.removeChild(textArea);
  };

  const handleOpenPolygonScan = () => {
    const url = getPolygonScanUrl(address, network);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-mono text-sm sm:text-base">
          {truncateAddress(address)}
        </span>
        <Badge variant={walletType === 'in-app' ? 'default' : 'secondary'}>
          {walletType === 'in-app' ? 'In-App' : 'External'}
        </Badge>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button
          onClick={handleCopy}
          size="sm"
          variant="outline"
          className="min-h-[44px] gap-2"
          aria-label="Copy wallet address to clipboard"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copy
            </>
          )}
        </Button>

        <Button
          onClick={handleOpenPolygonScan}
          size="sm"
          variant="outline"
          className="min-h-[44px] gap-2"
          aria-label="View address on PolygonScan"
        >
          <ExternalLink className="h-4 w-4" />
          PolygonScan
        </Button>

        <Button
          onClick={() => setShowQR(true)}
          size="sm"
          variant="outline"
          className="min-h-[44px] gap-2"
          aria-label="Show QR code"
        >
          <QrCode className="h-4 w-4" />
          QR Code
        </Button>
      </div>

      {showQR && (
        <WalletQRCode 
          address={address} 
          onClose={() => setShowQR(false)} 
        />
      )}
    </div>
  );
};
```

### Testing Requirements

**Verification Steps:**
1. Click "QR Code" button - modal opens
2. QR code displays correctly - 256x256 size
3. QR code is scannable - test with mobile device
4. Full address displayed below QR code
5. Click "Download QR Code" - PNG file downloads
6. Verify filename format: `tricktrack-wallet-0x123456.png`
7. Test on mobile devices - modal responsive

**QR Code Testing:**
- Scan with mobile wallet app - address recognized
- Scan with generic QR scanner - address displayed
- Test error correction level H - works with partial damage
- Verify white background for scanning

**Success Criteria:**
- QR code generates correctly
- QR code is scannable by mobile devices
- Download functionality works in all browsers
- PNG file has correct filename
- Modal is responsive on mobile
- All touch targets meet 44px minimum

### Dependencies

**Story 2.4.1** - Wallet address display must be implemented

### References

- [Source: `@stories-epic-02-wallet.md` - Story 2.4]
- [qrcode.react Documentation](https://www.npmjs.com/package/qrcode.react)

## Dev Agent Record

### Agent Model Used

Cascade (Windsurf IDE)

### Debug Log References

### Completion Notes List

### File List

