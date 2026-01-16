# Story 2.4: Display Wallet Address and Copy to Clipboard

Status: ready-for-dev

## Story

As a **user**,
I want **to view my wallet address and copy it to clipboard**,
So that **I can share my address or verify my identity**.

## Acceptance Criteria

1. **Given** I am logged in
   **When** I navigate to my profile
   **Then** my wallet address is displayed (truncated: `0x1234...5678`)
   **And** I can click "Copy" to copy full address
   **And** a toast confirms "Address copied!"
   **And** I can click address to view on PolygonScan
   **And** a QR code of my address is available

## Tasks / Subtasks

- [ ] Install QR code dependencies (AC: 1)
  - [ ] Install `qrcode.react` for QR code generation
  - [ ] Install `@types/qrcode.react` for TypeScript support
  - [ ] Verify QR code rendering
- [ ] Create wallet address display component (AC: 1)
  - [ ] Create `src/components/wallet/WalletAddressDisplay.tsx`
  - [ ] Implement address truncation (first 6 + last 4 chars)
  - [ ] Add wallet type badge (in-app/external)
  - [ ] Style with mobile-first design
- [ ] Implement copy to clipboard functionality (AC: 1)
  - [ ] Use `navigator.clipboard.writeText()` API
  - [ ] Add copy button with icon
  - [ ] Handle clipboard permission errors
  - [ ] Add fallback for unsupported browsers
- [ ] Add toast notifications (AC: 1)
  - [ ] Install `sonner` for toast notifications
  - [ ] Configure toast provider in layout
  - [ ] Show success toast on copy
  - [ ] Show error toast on failure
- [ ] Implement PolygonScan link (AC: 1)
  - [ ] Create clickable address link
  - [ ] Generate PolygonScan URL (mainnet/testnet)
  - [ ] Open in new tab with proper attributes
  - [ ] Add external link icon
- [ ] Create QR code component (AC: 1)
  - [ ] Create `src/components/wallet/WalletQRCode.tsx`
  - [ ] Generate QR code from wallet address
  - [ ] Add download QR code functionality
  - [ ] Style QR code with branding
- [ ] Add profile page integration (AC: 1)
  - [ ] Create `src/app/profile/page.tsx`
  - [ ] Display wallet address section
  - [ ] Add QR code modal/dialog
  - [ ] Show wallet connection status
- [ ] Implement accessibility features (AC: 1)
  - [ ] Add ARIA labels for screen readers
  - [ ] Ensure keyboard navigation works
  - [ ] Add focus states to interactive elements
  - [ ] Test with screen reader
- [ ] Verify wallet display functionality
  - [ ] Test address truncation displays correctly
  - [ ] Test copy to clipboard works
  - [ ] Verify toast notification appears
  - [ ] Test PolygonScan link opens correctly
  - [ ] Verify QR code generates correctly
  - [ ] Test on mobile devices (touch targets)

## Dev Notes

### Architecture Requirements

**Wallet Address Display** (from `@architecture.md`)

**Key Requirements:**
- Clear wallet address visibility (FR4)
- Easy sharing via QR code
- PolygonScan integration for verification
- Mobile-first design with 44px touch targets

**UX Principles:**
- Abstract blockchain complexity
- Make wallet address easy to share
- Provide visual confirmation of actions

### Utility Functions

**src/lib/utils/address.ts:**
```typescript
export const truncateAddress = (address: string, chars = 4): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-chars)}`;
};

export const getPolygonScanUrl = (address: string, network: 'mainnet' | 'testnet' = 'mainnet'): string => {
  const baseUrl = network === 'mainnet' 
    ? 'https://polygonscan.com' 
    : 'https://mumbai.polygonscan.com';
  return `${baseUrl}/address/${address}`;
};

export const isValidEthereumAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};
```

### Components Implementation

**src/components/wallet/WalletAddressDisplay.tsx:**
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
      // Fallback for browsers without clipboard API
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

**src/app/profile/page.tsx:**
```typescript
import { WalletAddressDisplay } from '@/components/wallet/WalletAddressDisplay';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@tricktrack/ui';
import { Wallet } from 'lucide-react';

export default function ProfilePage() {
  // In real implementation, get from auth context
  const mockUser = {
    address: '0x1234567890123456789012345678901234567890',
    walletType: 'in-app' as const,
  };

  return (
    <div className="container max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Profile</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Wallet Address
          </CardTitle>
          <CardDescription>
            Your unique blockchain address for receiving tokens and NFTs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <WalletAddressDisplay
            address={mockUser.address}
            walletType={mockUser.walletType}
            network="mainnet"
          />
        </CardContent>
      </Card>
    </div>
  );
}
```

### Toast Provider Setup

**Update apps/web/src/app/layout.tsx:**
```typescript
import { Toaster } from 'sonner';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <WagmiProvider>
          {children}
          <Toaster position="bottom-center" />
        </WagmiProvider>
      </body>
    </html>
  );
}
```

### Accessibility Implementation

**ARIA Labels and Keyboard Navigation:**
```typescript
// All interactive elements have proper ARIA labels
<Button
  onClick={handleCopy}
  aria-label="Copy wallet address to clipboard"
  aria-pressed={copied}
>
  Copy
</Button>

// Focus management for dialog
<Dialog 
  open={showQR} 
  onOpenChange={setShowQR}
  aria-labelledby="qr-code-title"
  aria-describedby="qr-code-description"
>
  {/* Dialog content */}
</Dialog>

// Keyboard shortcuts
useEffect(() => {
  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'c') {
      handleCopy();
    }
  };
  
  document.addEventListener('keydown', handleKeyPress);
  return () => document.removeEventListener('keydown', handleKeyPress);
}, []);
```

### Testing Requirements

**Verification Steps:**
1. Navigate to profile page - wallet address displayed
2. Address truncated correctly - shows 0x1234...5678 format
3. Click "Copy" button - address copied to clipboard
4. Toast notification appears - "Address copied!"
5. Click PolygonScan button - opens in new tab
6. Verify correct network URL (mainnet/testnet)
7. Click "QR Code" button - QR code modal opens
8. QR code displays correctly - scannable
9. Click "Download QR Code" - PNG file downloads
10. Test on mobile - all touch targets ≥ 44px

**Browser Compatibility:**
- Chrome/Edge (clipboard API)
- Firefox (clipboard API)
- Safari (clipboard API with permission)
- Mobile browsers (fallback copy method)

**Accessibility Testing:**
- Screen reader announces wallet address
- Keyboard navigation works (Tab, Enter, Esc)
- Focus visible on all interactive elements
- ARIA labels read correctly

**Success Criteria:**
- Address truncation works correctly
- Copy to clipboard succeeds in all browsers
- Toast notifications display properly
- PolygonScan link opens correct URL
- QR code generates and downloads
- All touch targets meet 44px minimum
- Accessibility features work correctly

### Dependencies

**Story 2.1 or 2.2** - User must have wallet connected

### References

- [Source: `@stories-epic-02-wallet.md` - Story 2.4]
- [Source: `@prd.md` - FR4: Wallet address display]
- [Source: `@ux-design-specification.md` - Mobile-first design]
- [Clipboard API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API)
- [qrcode.react Documentation](https://www.npmjs.com/package/qrcode.react)

## Dev Agent Record

### Agent Model Used

Cascade (Windsurf IDE)

### Debug Log References

### Completion Notes List

### File List

