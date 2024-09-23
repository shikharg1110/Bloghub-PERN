export function dateToShow(dateString) {
    const date = new Date(dateString);
  
    // Format the date to "Month Day, Year" (e.g., "September 20, 2024")
    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  
    // Format the time to "Hour:Minute AM/PM" (e.g., "10:35 AM")
    const formattedTime = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
  
    return `${formattedDate} at ${formattedTime}`;
};