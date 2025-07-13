import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/ui/gradient-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Video,
  Phone,
  MapPin,
  Users,
  Download,
  ExternalLink,
  Settings,
} from "lucide-react";
import { format, addDays, isSameDay } from "date-fns";

interface TimeSlot {
  id: string;
  start: string;
  end: string;
  isAvailable: boolean;
}

interface Booking {
  id: string;
  title: string;
  client: {
    name: string;
    avatar: string;
  };
  date: Date;
  time: string;
  duration: number;
  type: "consultation" | "meeting" | "call";
  status: "confirmed" | "pending" | "completed";
  meetingLink?: string;
}

interface WorkingHours {
  [key: string]: {
    enabled: boolean;
    start: string;
    end: string;
    breaks: { start: string; end: string }[];
  };
}

// Mock data
const defaultWorkingHours: WorkingHours = {
  monday: {
    enabled: true,
    start: "09:00",
    end: "17:00",
    breaks: [{ start: "12:00", end: "13:00" }],
  },
  tuesday: {
    enabled: true,
    start: "09:00",
    end: "17:00",
    breaks: [{ start: "12:00", end: "13:00" }],
  },
  wednesday: {
    enabled: true,
    start: "09:00",
    end: "17:00",
    breaks: [{ start: "12:00", end: "13:00" }],
  },
  thursday: {
    enabled: true,
    start: "09:00",
    end: "17:00",
    breaks: [{ start: "12:00", end: "13:00" }],
  },
  friday: {
    enabled: true,
    start: "09:00",
    end: "17:00",
    breaks: [{ start: "12:00", end: "13:00" }],
  },
  saturday: { enabled: false, start: "09:00", end: "17:00", breaks: [] },
  sunday: { enabled: false, start: "09:00", end: "17:00", breaks: [] },
};

const mockBookings: Booking[] = [
  {
    id: "BOOK-001",
    title: "Brand Strategy Consultation",
    client: { name: "Sarah Johnson", avatar: "/api/placeholder/40/40" },
    date: new Date(),
    time: "14:00",
    duration: 60,
    type: "consultation",
    status: "confirmed",
    meetingLink: "https://meet.google.com/abc-defg-hij",
  },
  {
    id: "BOOK-002",
    title: "Project Review Meeting",
    client: { name: "Mike Chen", avatar: "/api/placeholder/40/40" },
    date: addDays(new Date(), 1),
    time: "10:30",
    duration: 30,
    type: "meeting",
    status: "pending",
  },
  {
    id: "BOOK-003",
    title: "Design Feedback Call",
    client: { name: "Emily Davis", avatar: "/api/placeholder/40/40" },
    date: addDays(new Date(), 2),
    time: "15:00",
    duration: 45,
    type: "call",
    status: "confirmed",
    meetingLink: "https://zoom.us/j/123456789",
  },
];

interface CalendarAvailabilityProps {
  userType: "freelancer" | "client";
  userId: string;
}

export function CalendarAvailability({
  userType,
  userId,
}: CalendarAvailabilityProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [workingHours, setWorkingHours] =
    useState<WorkingHours>(defaultWorkingHours);
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [showAvailabilityDialog, setShowAvailabilityDialog] = useState(false);
  const [isGoogleCalendarSync, setIsGoogleCalendarSync] = useState(false);

  const generateTimeSlots = (date: Date): TimeSlot[] => {
    const dayName = format(date, "EEEE").toLowerCase();
    const dayHours = workingHours[dayName];

    if (!dayHours.enabled) return [];

    const slots: TimeSlot[] = [];
    const startHour = parseInt(dayHours.start.split(":")[0]);
    const endHour = parseInt(dayHours.end.split(":")[0]);

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute of [0, 30]) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        const isBooked = bookings.some(
          (booking) =>
            isSameDay(booking.date, date) && booking.time === timeString,
        );

        slots.push({
          id: `${format(date, "yyyy-MM-dd")}-${timeString}`,
          start: timeString,
          end: `${(minute === 30 ? hour + 1 : hour).toString().padStart(2, "0")}:${minute === 30 ? "00" : "30"}`,
          isAvailable: !isBooked,
        });
      }
    }

    return slots;
  };

  const updateWorkingHours = (day: string, field: string, value: any) => {
    setWorkingHours((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "completed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getMeetingTypeIcon = (type: string) => {
    switch (type) {
      case "consultation":
        return <Users className="w-4 h-4" />;
      case "meeting":
        return <Video className="w-4 h-4" />;
      case "call":
        return <Phone className="w-4 h-4" />;
      default:
        return <CalendarIcon className="w-4 h-4" />;
    }
  };

  const timeSlots = generateTimeSlots(selectedDate);
  const selectedDateBookings = bookings.filter((booking) =>
    isSameDay(booking.date, selectedDate),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Calendar & Availability</h2>
          <p className="text-muted-foreground">
            Manage your schedule and client bookings
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export ICS
          </Button>
          <Button variant="outline">
            <ExternalLink className="w-4 h-4 mr-2" />
            Sync Google Calendar
          </Button>
          <Dialog
            open={showAvailabilityDialog}
            onOpenChange={setShowAvailabilityDialog}
          >
            <DialogTrigger asChild>
              <GradientButton>
                <Settings className="w-4 h-4 mr-2" />
                Set Availability
              </GradientButton>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Working Hours & Availability</DialogTitle>
                <DialogDescription>
                  Set your weekly schedule and availability for client bookings.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {Object.entries(workingHours).map(([day, hours]) => (
                  <div
                    key={day}
                    className="flex items-center space-x-4 p-3 border border-border/40 rounded-lg"
                  >
                    <div className="w-24">
                      <span className="font-medium capitalize">{day}</span>
                    </div>
                    <Switch
                      checked={hours.enabled}
                      onCheckedChange={(enabled) =>
                        updateWorkingHours(day, "enabled", enabled)
                      }
                    />
                    {hours.enabled && (
                      <>
                        <div className="flex items-center space-x-2">
                          <Input
                            type="time"
                            value={hours.start}
                            onChange={(e) =>
                              updateWorkingHours(day, "start", e.target.value)
                            }
                            className="w-32"
                          />
                          <span className="text-muted-foreground">to</span>
                          <Input
                            type="time"
                            value={hours.end}
                            onChange={(e) =>
                              updateWorkingHours(day, "end", e.target.value)
                            }
                            className="w-32"
                          />
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowAvailabilityDialog(false)}
                >
                  Cancel
                </Button>
                <GradientButton
                  onClick={() => setShowAvailabilityDialog(false)}
                >
                  Save Changes
                </GradientButton>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="calendar" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="bookings">Upcoming Bookings</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
        </TabsList>

        {/* Calendar View */}
        <TabsContent value="calendar">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Select Date</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Schedule for {format(selectedDate, "MMMM d, yyyy")}
                  <Badge variant="outline">
                    {selectedDateBookings.length} booking
                    {selectedDateBookings.length !== 1 ? "s" : ""}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedDateBookings.length > 0 ? (
                    selectedDateBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between p-4 border border-border/40 rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="p-2 rounded-full bg-primary/10">
                            {getMeetingTypeIcon(booking.type)}
                          </div>
                          <div>
                            <h4 className="font-medium">{booking.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              with {booking.client.name}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Clock className="w-3 h-3 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">
                                {booking.time} ({booking.duration} min)
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
                          {booking.meetingLink && (
                            <Button variant="outline" size="sm" asChild>
                              <a
                                href={booking.meetingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Video className="w-3 h-3 mr-1" />
                                Join
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <CalendarIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No bookings for this date</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Bookings List */}
        <TabsContent value="bookings">
          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Upcoming Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bookings
                  .filter((booking) => booking.date >= new Date())
                  .sort((a, b) => a.date.getTime() - b.date.getTime())
                  .map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-4 border border-border/40 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="p-3 rounded-full bg-primary/10">
                          {getMeetingTypeIcon(booking.type)}
                        </div>
                        <div>
                          <h4 className="font-medium">{booking.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            with {booking.client.name}
                          </p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <CalendarIcon className="w-3 h-3" />
                              <span>{format(booking.date, "MMM d, yyyy")}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>
                                {booking.time} ({booking.duration} min)
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status}
                        </Badge>
                        {booking.meetingLink && (
                          <Button variant="outline" size="sm" asChild>
                            <a
                              href={booking.meetingLink}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Video className="w-3 h-3 mr-1" />
                              Join Meeting
                            </a>
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          Reschedule
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Availability Management */}
        <TabsContent value="availability">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Available Time Slots</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {timeSlots.map((slot) => (
                    <div
                      key={slot.id}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        slot.isAvailable
                          ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
                          : "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20"
                      }`}
                    >
                      <span className="font-medium">
                        {slot.start} - {slot.end}
                      </span>
                      <Badge
                        variant={slot.isAvailable ? "default" : "secondary"}
                      >
                        {slot.isAvailable ? "Available" : "Booked"}
                      </Badge>
                    </div>
                  ))}
                  {timeSlots.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No availability set for this day</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Integration Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Google Calendar Sync</h4>
                    <p className="text-sm text-muted-foreground">
                      Automatically sync your bookings with Google Calendar
                    </p>
                  </div>
                  <Switch
                    checked={isGoogleCalendarSync}
                    onCheckedChange={setIsGoogleCalendarSync}
                  />
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Meeting Preferences</h4>
                  <div className="space-y-2">
                    <Label>Default meeting duration</Label>
                    <Select defaultValue="60">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="90">1.5 hours</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Buffer time between meetings</Label>
                    <Select defaultValue="15">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">No buffer</SelectItem>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Booking Links</h4>
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p className="text-sm font-medium mb-1">
                      Your booking link:
                    </p>
                    <div className="flex items-center space-x-2">
                      <code className="text-xs bg-muted px-2 py-1 rounded flex-1">
                        https://freelancehub.com/book/{userId}
                      </code>
                      <Button variant="outline" size="sm">
                        Copy
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
