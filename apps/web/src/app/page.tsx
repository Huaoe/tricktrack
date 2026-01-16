import { Button } from "@tricktrack/ui";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@tricktrack/ui";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <main className="flex w-full max-w-md flex-col items-center gap-8 text-center">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-4xl">TrickTrack</CardTitle>
            <CardDescription className="text-lg">
              Validate skateboarding tricks with friends, earn crypto rewards
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Button size="lg" className="w-full">
              Get Started
            </Button>
            <Button variant="outline" size="lg" className="w-full">
              Learn More
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              Mobile-first PWA • Offline Support • Web3 Rewards
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
