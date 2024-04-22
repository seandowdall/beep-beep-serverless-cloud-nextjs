export interface Car {
  CarID: string;
  availability: boolean;
  description: string;
  features: string[];
  images: string[];
  location: string;
  make: string;
  model: string;
  price: number;
  type: string;
  year: number;
  userID: string;
}

export interface Booking {
  BookingID: string;
  userID: string;
  isApproved: boolean;
  startDate: string; // ISO string format for date
  endDate: string; // ISO string format for date
  // make: string;
  // model: string;
  // totalCost: number;
}
