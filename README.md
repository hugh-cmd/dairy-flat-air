# Dairy Flat Air Booking System

A web-based online booking system for a fictitious regional airline operating from Dairy Flat Airport.

Live site:

https://dairy-flat-air.vercel.app/

GitHub repository:

https://github.com/hugh-cmd/dairy-flat-air

## Overview

Dairy Flat Air is a Next.js and MongoDB Atlas application that allows users to search scheduled flights, make bookings, view booking invoices, cancel bookings, and look up all confirmed flights booked by a passenger.

The airline operates point-to-point scheduled services with Dairy Flat Airport as the hub.

## Tech Stack

* Next.js
* TypeScript
* Tailwind CSS
* MongoDB Atlas
* Vercel
* GitHub

## Main Features

### Landing Page

The landing page acts as the entry point for the application.

It includes:

* Dairy Flat Air branding
* Main booking actions
* Route network summary
* Fleet summary
* Links to search flights and manage bookings

### Flight Search

Users can search scheduled flights by:

* Origin airport
* Destination airport
* Start date
* End date

The search results display:

* Flight number
* Route
* Departure date and time
* Arrival date and time
* Local time zones
* Aircraft type
* Available seats
* Price per seat
* Link to select a flight

The search form prevents users from selecting the same origin and destination.

### Flight Booking

Users can select a scheduled flight and make a booking by entering:

* Passenger name
* Passenger email
* Number of seats

After a successful booking, the system generates a booking reference, such as:

```txt
DFA-H6VYT9
```

The application checks that a generated booking reference does not already exist before saving the booking.

### Seat Availability

The system prevents overbooking.

Before creating a booking, it checks the number of confirmed booked seats against the aircraft capacity.

The booking update also checks whether flight availability has changed during the booking process. If availability changes while a booking is being created, the user is asked to try again.

### Booking Invoice

After a booking is created, the user is redirected to an invoice page.

The invoice displays:

* Booking reference
* Passenger name
* Passenger email
* Booking status
* Flight number
* Route
* Departure date and time
* Arrival date and time
* Local time zones
* Aircraft type
* Number of seats
* Price per seat
* Total price

### Cancel Booking

Users can cancel a confirmed booking from the invoice page.

When a booking is cancelled:

* The booking status changes from `confirmed` to `cancelled`
* A cancellation time is recorded
* The seats become available again
* Cancelled bookings are not shown in passenger confirmed-flight lookup results

### Passenger Flight Lookup

On the Manage Bookings page, users can enter a passenger email address to view all confirmed scheduled flights booked for that passenger.

Each result includes:

* Booking reference
* Flight number
* Route
* Departure time
* Arrival time
* Local time zones
* Aircraft type
* Seats booked
* Total price
* Link to view the invoice

## Airline Routes

Dairy Flat Air operates scheduled services between Dairy Flat Airport and selected destinations.

| Route                                       | Aircraft       | Schedule                    |
| ------------------------------------------- | -------------- | --------------------------- |
| Dairy Flat to Sydney                        | SyberJet SJ30i | Friday outbound             |
| Sydney to Dairy Flat                        | SyberJet SJ30i | Sunday return               |
| Dairy Flat to Rotorua                       | Cirrus SF50    | Twice every weekday         |
| Rotorua to Dairy Flat                       | Cirrus SF50    | Twice every weekday         |
| Dairy Flat to Great Barrier Island / Claris | Cirrus SF50    | Monday, Wednesday, Friday   |
| Great Barrier Island / Claris to Dairy Flat | Cirrus SF50    | Tuesday, Thursday, Saturday |
| Dairy Flat to Chatham Islands / Tuuta       | HondaJet Elite | Tuesday, Friday             |
| Chatham Islands / Tuuta to Dairy Flat       | HondaJet Elite | Wednesday, Saturday         |
| Dairy Flat to Lake Tekapo                   | HondaJet Elite | Monday                      |
| Lake Tekapo to Dairy Flat                   | HondaJet Elite | Tuesday                     |

## Aircraft Fleet

| Aircraft       |     Capacity | Use                                      |
| -------------- | -----------: | ---------------------------------------- |
| SyberJet SJ30i | 6 passengers | Sydney prestige service                  |
| Cirrus SF50    | 4 passengers | Rotorua shuttle and Great Barrier routes |
| HondaJet Elite | 5 passengers | Chatham Islands and Lake Tekapo routes   |

## Airports

| ICAO Code | Airport                               |
| --------- | ------------------------------------- |
| NZNE      | Dairy Flat Airport                    |
| YSSY      | Sydney Airport                        |
| NZRO      | Rotorua Airport                       |
| NZGB      | Claris Airport / Great Barrier Island |
| NZCI      | Tuuta Airport / Chatham Islands       |
| NZTL      | Lake Tekapo Airport                   |

## Time Zones

The seed data stores both UTC times and local display times.

The application handles and displays local time zones for:

* Mainland New Zealand: `Pacific/Auckland`
* Sydney: `Australia/Sydney`
* Chatham Islands: `Pacific/Chatham`

Flight results and invoices show the relevant departure and arrival time zones.

Example:

```txt
Depart: 2026-06-12 10:00 (Pacific/Auckland)
Arrive: 2026-06-12 12:30 (Australia/Sydney)
```

## Database Design

The application uses MongoDB Atlas.

### Collections

#### `airports`

Stores airport information, including:

* Airport code
* Airport name
* City
* Time zone
* UTC offset

#### `schedules`

Stores scheduled flights for real calendar dates.

Each schedule document includes:

* Flight number
* Origin
* Destination
* Departure time
* Arrival time
* Local display times
* Time zones
* Aircraft type
* Capacity
* Price
* Bookings

Bookings are embedded inside schedule documents because each scheduled flight has a small number of passengers.

Example schedule structure:

```js
{
  flightNumber: "DFA101",
  origin: "NZNE",
  destination: "YSSY",
  originCity: "Dairy Flat",
  destinationCity: "Sydney",
  originTimezone: "Pacific/Auckland",
  destinationTimezone: "Australia/Sydney",
  departureLocal: "2026-06-12 10:00",
  arrivalLocal: "2026-06-12 12:30",
  aircraftName: "SyberJet SJ30i",
  capacity: 6,
  price: 1200,
  bookings: [
    {
      reference: "DFA-H6VYT9",
      passengerName: "Example Passenger",
      passengerEmail: "example@example.com",
      seats: 1,
      status: "confirmed",
      totalPrice: 1200,
      createdAt: "2026-05-28T03:17:38.484Z",
      cancelledAt: null
    }
  ]
}
```

## API Routes

| Method | Endpoint                        | Description                                      |
| ------ | ------------------------------- | ------------------------------------------------ |
| GET    | `/api/test-db`                  | Tests MongoDB Atlas connection                   |
| GET    | `/api/schedules`                | Searches scheduled flights                       |
| GET    | `/api/schedules/[id]`           | Gets one scheduled flight                        |
| POST   | `/api/bookings`                 | Creates a booking                                |
| GET    | `/api/bookings/[reference]`     | Gets booking invoice details                     |
| DELETE | `/api/bookings/[reference]`     | Cancels a booking                                |
| GET    | `/api/passenger-flights?email=` | Gets all confirmed flights booked by a passenger |

Example schedule search:

```txt
/api/schedules?date1=2026-06-10&date2=2026-06-30&orig=NZNE&dest=YSSY
```

Example passenger lookup:

```txt
/api/passenger-flights?email=example@example.com
```

## Real Calendar Dates

The seed script generates scheduled flights using real calendar dates.

The database is seeded with 70 days of scheduled flights starting from 2026-06-01.

Current seed output:

```txt
Inserted 6 airports.
Inserted 340 schedules.
```

This means the application supports more than one week of scheduled flights.

## Local Development

Install dependencies:

```bash
npm install
```

Create a `.env.local` file in the project root:

```env
MONGODB_URI=your_mongodb_atlas_connection_string
MONGODB_DB=dairyflat
```

Run the development server:

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

## Seed the Database

Run:

```bash
npm run seed
```

The seed script inserts airports and scheduled flights into MongoDB Atlas.

Warning: running the seed script resets the existing `airports` and `schedules` collections before inserting fresh data.

## Lint

Run:

```bash
npm run lint
```

## Build

Run:

```bash
npm run build
```

## Deployment

The application is deployed on Vercel:

```txt
https://dairy-flat-air.vercel.app/
```

The following environment variables are configured in Vercel:

```txt
MONGODB_URI
MONGODB_DB
```

## Notes

* The application does not include registration or login because it is not required.
* Passenger email is used as the customer identifier for passenger flight lookup.
* Booking references are generated automatically and checked for uniqueness before saving.
* Full flights cannot be booked.
* Cancelled bookings are kept in the database with status `cancelled`.
* Flight times are shown with local time zones to make cross-time-zone routes clearer.
