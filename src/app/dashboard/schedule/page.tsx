import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";

export default function SchedulePage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="font-headline text-3xl font-bold tracking-tight">My Schedule</h1>
        <p className="text-muted-foreground">View your upcoming and past jobs.</p>
      </div>

      <Card>
        <CardContent className="p-2 md:p-4">
          <Calendar
            mode="single"
            // selected={new Date()} // This can be managed with state
            className="w-full"
            classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                month: "space-y-4 flex-grow",
                table: "w-full border-collapse space-y-1",
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
