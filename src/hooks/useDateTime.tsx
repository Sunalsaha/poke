// import { useState, useEffect } from 'react';

// export const useDateTime = () => {
//   const [dateTime, setDateTime] = useState(new Date());

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setDateTime(new Date());
//     }, 1000);

//     return () => clearInterval(interval);
//   }, []);

//   const formatTime = (date: Date) => {
//     return date.toLocaleTimeString('en-US', {
//       hour12: false,
//       hour: '2-digit',
//       minute: '2-digit',
//       second: '2-digit'
//     });
//   };

//   const formatDate = (date: Date) => {
//     return date.toLocaleDateString('en-US', {
//       weekday: 'short',
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   return {
//     time: formatTime(dateTime),
//     date: formatDate(dateTime),
//     dateTime
//   };
// };