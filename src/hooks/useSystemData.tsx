// import { useState, useEffect } from 'react';

// export const useSystemData = () => {
//   const [systemData, setSystemData] = useState({
//     os: "Windows",
//     os_version: "10.0.26100",
//     cpu: { 
//       usage_percent: 12.5, 
//       cores: 4, 
//       threads: 8, 
//       base_speed_ghz: 2.80, 
//       current_speed_ghz: 3.12 
//     },
//     ram: { 
//       total_gb: 16.0, 
//       used_gb: 12.3, 
//       available_gb: 3.7, 
//       percent: 77.0 
//     },
//     disks: { 
//       "C:\\": { 
//         total_gb: 200.0, 
//         used_gb: 161.1, 
//         percent: 80.6 
//       } 
//     },
//     network: { 
//       local_ip: "192.168.1.12", 
//       public_ip: "103.45.78.91", 
//       bytes_sent_mb: 234.5, 
//       bytes_recv_mb: 987.2, 
//       interfaces: ["Ethernet", "Wi-Fi"],
//       signal_strength: "100%"
//     },
//     battery: { 
//       percent: 88, 
//       charging: true, 
//       time_remaining_min: 120 
//     },
//     timeline: { 
//       boot_time: "2025-08-30 09:12:34", 
//       uptime_hours: 13.5, 
//       current_time: "2025-08-31 19:42:10" 
//     },
//     top_processes: [
//       { pid: 1234, name: "chrome.exe", cpu_percent: 15.2, memory_percent: 8.3 },
//       { pid: 5678, name: "discord.exe", cpu_percent: 7.0, memory_percent: 5.1 }
//     ],
//     speed: { 
//       download_mbps: 713.2, 
//       upload_mbps: 210.5, 
//       ping_ms: 19 
//     }
//   });

//   useEffect(() => {
//     // Simulate real-time system data updates
//     const interval = setInterval(() => {
//       setSystemData(prev => ({
//         ...prev,
//         cpu: {
//           ...prev.cpu,
//           usage_percent: Math.max(5, Math.min(95, prev.cpu.usage_percent + (Math.random() - 0.5) * 10)),
//           current_speed_ghz: Math.max(2.8, Math.min(4.2, prev.cpu.current_speed_ghz + (Math.random() - 0.5) * 0.2))
//         },
//         ram: {
//           ...prev.ram,
//           used_gb: Math.max(8, Math.min(15, prev.ram.used_gb + (Math.random() - 0.5) * 1)),
//           percent: Math.max(50, Math.min(95, prev.ram.percent + (Math.random() - 0.5) * 5))
//         },
//         network: {
//           ...prev.network,
//           bytes_sent_mb: prev.network.bytes_sent_mb + Math.random() * 2,
//           bytes_recv_mb: prev.network.bytes_recv_mb + Math.random() * 5
//         },
//         battery: {
//           ...prev.battery,
//           percent: Math.max(20, Math.min(100, prev.battery.percent + (Math.random() - 0.5) * 2))
//         },
//         top_processes: prev.top_processes.map(process => ({
//           ...process,
//           cpu_percent: Math.max(0, Math.min(30, process.cpu_percent + (Math.random() - 0.5) * 5)),
//           memory_percent: Math.max(1, Math.min(15, process.memory_percent + (Math.random() - 0.5) * 2))
//         }))
//       }));
//     }, 2000);

//     return () => clearInterval(interval);
//   }, []);

//   return systemData;
// };