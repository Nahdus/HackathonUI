"use client"

import { useState, useEffect, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line, ScatterChart, Scatter } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Menu, X, ArrowUp, ArrowDown, Minus } from 'lucide-react'
import NetworkMap from "../NetworkMap/Networkmap"
import { io } from "socket.io-client"

// Mock data (replace with real data in production)
const networkData = [
  { id: 'Node1', x: 0, y: 0, z: 0 },
  { id: 'Node2', x: 1, y: 1, z: 1 },
  { id: 'Node3', x: -1, y: 1, z: -1 },
  { id: 'Node4', x: 1, y: -1, z: 1 },
]

const ticketData = [
  { node: 'Node1', total: 50, high: 10, medium: 20, low: 20 },
  { node: 'Node2', total: 30, high: 5, medium: 15, low: 10 },
  { node: 'Node3', total: 40, high: 8, medium: 22, low: 10 },
  { node: 'Node4', total: 20, high: 2, medium: 8, low: 10 },
  { node: 'Node5', total: 50, high: 10, medium: 20, low: 20 },
  { node: 'Node6', total: 30, high: 5, medium: 15, low: 10 },
  { node: 'Node7', total: 40, high: 8, medium: 22, low: 10 },
  { node: 'Node8', total: 20, high: 2, medium: 8, low: 10 },
  { node: 'Node9', total: 50, high: 10, medium: 20, low: 20 },
  { node: 'Node10', total: 30, high: 5, medium: 15, low: 10 },
  { node: 'Node11', total: 40, high: 8, medium: 22, low: 10 },
  { node: 'Node12', total: 20, high: 2, medium: 8, low: 10 },
]



let calculatePoissionData=(lambda:number,range=20)=>{
  
  let Kstart = Math.max(0,Math.floor(lambda-range))
  let Kend = Math.ceil(lambda+range)
  let  poissonData = Array.from({ length: Kend-Kstart }, (_, index) =>{
    let k = Kstart + index;
    return {
      k,
      probability: (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k),
    };
  })
  return poissonData
}


function factorial(n: number): number {
  if (n === 0 || n === 1) return 1
  return n * factorial(n - 1)
}

const vulnerabilityData = [
  { name: 'Unpatched Systems', value: 30 },
  { name: 'Weak Passwords', value: 25 },
  { name: 'Misconfigured Firewalls', value: 20 },
  { name: 'Outdated Software', value: 15 },
  { name: 'Unsecured APIs', value: 10 },
]

// function NetworkNode({ position, label }: { position: [number, number, number], label: string }) {
//   return (
//     <group position={position}>
//       <mesh>
//         <sphereGeometry args={[0.1, 32, 32]} />
//         <meshStandardMaterial color="blue" />
//       </mesh>
//       <Text position={[0, 0.15, 0]} fontSize={0.1} color="white">
//         {label}
//       </Text>
//     </group>
//   )
// }

function VulnerabilityAnalysis() {
  const vulnerabilityData = [
    { name: 'Unpatched Systems', status: 'neutral', change: 0 },
    { name: 'Weak Passwords', status: 'neutral', change: 0 },
    { name: 'Misconfigured Firewalls', status: 'neutral', change: 0 },
    { name: 'Outdated Software', status: 'neutral', change: 0 },
    { name: 'Unsecured APIs', status: 'neutral', change: 0 },
  ]

  const calculateVulnerablity=()=>{
    vulnerabilityData.forEach((each)=>{
      each["status"] = ["increase","decrease","neutral"][Math.floor(Math.random()*4)]
      if (each["status"]=="neutral"){
        each["change"] = 0
      }else{
        each["change"] = Math.floor(1+Math.random()*5)
      }
    })
  }
  //setInterval(calculateVulnerablity,40000)
  calculateVulnerablity()
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'increase':
        return <ArrowUp className="text-red-500" />
      case 'decrease':
        return <ArrowDown className="text-green-500" />
      default:
        return <Minus className="text-gray-500" />
    }
  }

  const getStatusText = (status: string, change: number) => {
    switch (status) {
      case 'increase':
        return `Increased by ${change}`
      case 'decrease':
        return `Decreased by ${change}`
      default:
        return 'No change'
    }
  }

  const getSummary = () => {
    const increasedVulnerabilities = vulnerabilityData.filter(v => v.status === 'increase').length
    const decreasedVulnerabilities = vulnerabilityData.filter(v => v.status === 'decrease').length

    if (increasedVulnerabilities > decreasedVulnerabilities) {
      return "Overall vulnerability risk has increased. Immediate action required."
    } else if (decreasedVulnerabilities > increasedVulnerabilities) {
      return "Overall vulnerability risk has decreased. Continue monitoring and improving."
    } else {
      return "Vulnerability risk remains stable. Maintain current security measures."
    }
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      
      <div className="space-y-4">
        {vulnerabilityData.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="font-medium">{item.name}</span>
            <div className="flex items-center space-x-2">
              {getStatusIcon(item.status)}
              <span className={`text-sm ${
                item.status === 'increase' ? 'text-red-500' :
                item.status === 'decrease' ? 'text-green-500' :
                'text-gray-500'
              }`}>
                {getStatusText(item.status, item.change)}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 p-4 bg-gray-100 rounded-md">
        <h4 className="font-semibold mb-2">Summary</h4>
        <p className="text-sm">{getSummary()}</p>
      </div>
    </div>
  )
}


// function NetworkMap() {
//   return (
//     <Canvas camera={{ position: [0, 0, 5] }}>
//       <ambientLight intensity={0.5} />
//       <pointLight position={[10, 10, 10]} />
//       {networkData.map((node) => (
//         <NetworkNode key={node.id} position={[node.x, node.y, node.z]} label={node.id} />
//       ))}
//       <OrbitControls />
//     </Canvas>
//   )
// }

function TicketHistogram({ticketData}:{ticketData:any}) {
  console.log(ticketData)
  let cleanTicketData = [...ticketData].map(each=>{
    return each
  })
  return (
    <BarChart width={500} height={300} data={cleanTicketData}>
      <XAxis dataKey="node" />
      <YAxis/>
      <Tooltip/>
      <Legend/>
      <Bar dataKey="High" stackId="a" fill="#D2222D" />
      <Bar dataKey="Medium" stackId="a" fill="#FFBF00" />
      <Bar dataKey="Low" stackId="a" fill="#238823" />
    </BarChart>
  )
}

function PoissonDistribution({rate}:{rate:number}) {
  return (
    <LineChart width={500} height={300} data={calculatePoissionData(rate)}>
      <XAxis dataKey="k" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="probability" stroke="#8884d8" />
    </LineChart>
  )
}

// function VulnerabilityChart() {
//   return (
//     <ScatterChart width={500} height={300}>
//       <XAxis type="category" dataKey="name" name="Vulnerability" />
//       <YAxis type="number" dataKey="value" name="Risk Score" />
//       <Tooltip cursor={{ strokeDasharray: '3 3' }} />
//       <Scatter name="Vulnerabilities" data={vulnerabilityData} fill="#8884d8" />
//     </ScatterChart>
//   )
// }

function IncomingTickets({tickets}:{tickets:any}) {
  // const [tickets, setTickets] = useState<{ id: number; title: string; description: string; priority: string; timestamp: string }[]>([])
  
  const ticketContainerRef = useRef<HTMLDivElement>(null)

  // useEffect(() => {
  //   const priorities = ['Low', 'Medium', 'High', 'Critical']
  //   const ticketTitles = [
  //     'Server Down',
  //     'Network Latency',
  //     'Database Error',
  //     'Security Breach',
  //     'Application Crash',
  //     'API Failure',
  //     'User Authentication Issue',
  //     'Data Corruption',
  //     'Memory Leak',
  //     'Disk Space Warning'
  //   ]
  //   const descriptions = [
  //     'User experiencing frequent disconnections',
  //     'Slow response times across multiple services',
  //     'Unable to read or write to database',
  //     'Unusual access patterns detected',
  //     'Application terminating unexpectedly',
  //     'API endpoints returning 500 errors',
  //     'Users unable to log in',
  //     'Data integrity issues detected',
  //     'System resources depleting rapidly',
  //     'Storage capacity reaching critical levels'
  //   ]

  //   const addTicket = () => {
  //     const newTicket = {
  //       id: Date.now(),
  //       title: ticketTitles[Math.floor(Math.random() * ticketTitles.length)],
  //       description: descriptions[Math.floor(Math.random() * descriptions.length)],
  //       priority: priorities[Math.floor(Math.random() * priorities.length)],
  //       timestamp: new Date().toLocaleTimeString()
  //     }
  //     setTickets(prevTickets => [newTicket, ...prevTickets].slice(0, 50))
  //     // networkMap,
  //     // nodeCordinate,
  //     // nodeAttributes

      
  //   }

  //   const intervalId = setInterval(addTicket, 5000)

  //   return () => clearInterval(intervalId)
  // }, [])

  

  useEffect(() => {
    if (ticketContainerRef.current) {
      ticketContainerRef.current.scrollTop = 0
    }
  }, [tickets])

  return (
    <div ref={ticketContainerRef} className="h-80 overflow-y-auto bg-gray-100 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-4 sticky top-0 bg-gray-100 z-10">Incoming Tickets</h3>
      <div className="space-y-4">
        {tickets.map(ticket => (
          <div key={ticket.id} className="bg-gray-800 text-white rounded-lg overflow-hidden shadow-lg">
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-lg font-semibold">{ticket.title}</h4>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  ticket.priority === 'Low' ? 'bg-green-500 text-white' :
                  ticket.priority === 'Medium' ? 'bg-yellow-500 text-gray-800' :
                  ticket.priority === 'High' ? 'bg-orange-500 text-white' :
                  'bg-red-500 text-white'
                }`}>
                  {ticket.priority}
                </span>
              </div>
              <p className="text-sm mb-2">{ticket.description}</p>
              <div className="flex justify-between items-center text-xs text-gray-400">
                <span>Ticket ID: {ticket.id}</span>
                <span>{ticket.timestamp}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function IncidentDashboard() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  
  // const networkDetails = [
  //   { node: 'Node1', total: 50, high: 10, medium: 20, low: 20 },
  //   { node: 'Node2', total: 30, high: 5, medium: 15, low: 10 },
  //   { node: 'Node3', total: 40, high: 8, medium: 22, low: 10 },
  //   { node: 'Node4', total: 20, high: 2, medium: 8, low: 10 },
  // ]
  const [networkDetails, setNetworkDetails] = useState({networkMap:{},nodeCordinate:{},nodeAttributes:{}})
  // const newTicket = {
  //   id: Date.now(),
  //   title: ticketTitles[Math.floor(Math.random() * ticketTitles.length)],
  //   description: descriptions[Math.floor(Math.random() * descriptions.length)],
  //   priority: priorities[Math.floor(Math.random() * priorities.length)],
  //   timestamp: new Date().toLocaleTimeString()
  // }

  const [ticketData, setTicketData] = useState<{ id: number; title: string; description: string; priority: string; timestamp: string, nodeId: string }[]>([])
  const [numberOfTickets, setNumberOfTickets] = useState<number>(0)
  const [startTime,setStartTime] = useState(Date.now())
  const [rate,setRate]= useState(0)  
  // const histogram = [
  //   { node: 'Node1', total: 50, high: 10, medium: 20, low: 20 },
  //   { node: 'Node2', total: 30, high: 5, medium: 15, low: 10 },
  //   { node: 'Node3', total: 40, high: 8, medium: 22, low: 10 },
  //   { node: 'Node4', total: 20, high: 2, medium: 8, low: 10 },
  //   { node: 'Node5', total: 50, high: 10, medium: 20, low: 20 },
  //   { node: 'Node6', total: 30, high: 5, medium: 15, low: 10 },
  //   { node: 'Node7', total: 40, high: 8, medium: 22, low: 10 },
  //   { node: 'Node8', total: 20, high: 2, medium: 8, low: 10 },
  //   { node: 'Node9', total: 50, high: 10, medium: 20, low: 20 },
  //   { node: 'Node10', total: 30, high: 5, medium: 15, low: 10 },
  //   { node: 'Node11', total: 40, high: 8, medium: 22, low: 10 },
  //   { node: 'Node12', total: 20, high: 2, medium: 8, low: 10 },
  // ]


  const [histogramInfo, setHistogramInfo] = useState<{node:string, total:number, high:number, medium:number, low:number, id:string}[]>([])

  const  getCurrentTime =()=> {
    const now = new Date(); // Get the current date and time
    let hours = now.getHours(); // getHours() returns hours in 24-hour format
    let minutes = now.getMinutes(); // getMinutes() returns the minutes
    let seconds = now.getSeconds(); // getSeconds() returns the seconds

    // Pad single digit minutes and seconds with a leading zero
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    // Construct the time string in HH:MM:SS format
    const timeString = `${hours}:${minutes}:${seconds}`;

    return timeString; // Print the time
}
// ['Low', 'Medium', 'High', 'Critical']
const priorityMap = {"p1":'Critical', 
                      "p2":'High', 
                      "p3":'Medium', 
                      "p4":'Low',
                      "p5":"Low"
                      }
const priorityMap2 = {
  "p1":'High', 
  "p2":'High', 
  "p3":'Medium', 
  "p4":'Low',
  "p5":"Low"
  }

  useEffect(()=>{
    if(numberOfTickets==0)
    setStartTime(Date.now())
  },[])

  useEffect(() => {
    const updateRate = () => {
      const currentTime = Date.now();
      const timeElapsed = (currentTime - startTime) / 60000; // Convert milliseconds to seconds
      if (timeElapsed > 0) {
        setRate(numberOfTickets / timeElapsed); // Calculate tickets per second
      }
    };

    // Update rate every second
    const intervalId = setInterval(updateRate, 1000);

    return () => clearInterval(intervalId);
  }, [numberOfTickets, startTime]);


  useEffect(() => {
    // Create a new WebSocket instance
    console.log(import.meta.env.VITE_WEBSOCKET_ENDPOINT)
    const socket = new WebSocket(import.meta.env.VITE_WEBSOCKET_ENDPOINT);

    // Set up event listeners for WebSocket
    socket.onmessage = (event) => {
      
      let data = JSON.parse(event.data);
      // let data = JSON.parse(partialParse)
      if (Object.keys(data).indexOf("networkMap")!==-1){
        setNetworkDetails(data)
        Object.keys(data.networkMap).forEach((eachKey:string)=>{
          
            setHistogramInfo(prevInfo=>{
              if(prevInfo.length==0){

                return [...prevInfo,{"node":eachKey.slice(0,4),"total":0,"Low":0,"Medium":0,"High":0,"id":eachKey}]
              }
              if (prevInfo.filter(eachData=>{
                return eachData.id==eachKey
              }).length==0){
                return [...prevInfo,{"node":eachKey.slice(0,4),"total":0,"Low":0,"Medium":0,"High":0,"id":eachKey}]
              }
              return prevInfo
            })
          })
        }
        
      
      if (Object.keys(data).indexOf("priority")!==-1){
        // "priority": "p4",
        // "nodeid": "5799d435-e58f-41bf-b063-4bdcb0a1e18b",
        // "heading": "Major hard",
        // "description": "Major hardware failure detected. All communication services are offline. Urgent replacement needed."

        let newTicket={
          "id":uuidv4(),
          "title":data["heading"],
          "description":data["description"],
          "priority":priorityMap[data["priority"]],
          "timestamp":getCurrentTime(),
          "nodeId":data.nodeid
        }
        setTicketData(prevTickets => [newTicket, ...prevTickets].slice(0, 50))
        setHistogramInfo(prevInfo=>{
          let copyPrevInfo = [...prevInfo]
          copyPrevInfo.forEach((each,i)=>{
            if (each["id"]==data.nodeid){
              
                // {"node":eachKey.slice(0,4),"total":0,"low":0,"medium":0,"high":0,"id":eachKey}
                setNumberOfTickets(prevNumber=>prevNumber+1)
                copyPrevInfo[i]["total"] = copyPrevInfo[i]["total"] + 1
                copyPrevInfo[i][priorityMap2[data["priority"]]] = copyPrevInfo[i][priorityMap2[data["priority"]]]+1
                // return copyPrevInfo
            }
          })
          return prevInfo
        })
      }

    };
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <nav className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="font-bold text-xl">Smart Network Monitoring Hub</span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="#" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">Dashboard</a>
                <a href="#" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">Reports</a>
                <a href="#" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">Settings</a>
              </div>
            </div>
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a href="#" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700">Dashboard</a>
              <a href="#" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700">Reports</a>
              <a href="#" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700">Settings</a>
            </div>
          </div>
        )}
      </nav>

      {/* Main content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* <h1 className="text-3xl font-bold mb-6">Incident Analytics Dashboard</h1> */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Network Map</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <NetworkMap networkDetails={networkDetails}/>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Ticket Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <TicketHistogram ticketData={histogramInfo}/>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Incident Rate (Poisson Distribution)</CardTitle>
            </CardHeader>
            <CardContent>
              <PoissonDistribution rate={rate}/>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Vulnerability Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <VulnerabilityAnalysis />
            </CardContent>
          </Card>
        </div>
        
        {/* Incoming Tickets Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Live Ticket Feed</CardTitle>
          </CardHeader>
          <CardContent>
            <IncomingTickets tickets={ticketData}/>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p>&copy; 2024 Smart Network Monitoring Hub. Powered by Team Sigma.</p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="hover:underline">Privacy Policy</a>
              <a href="#" className="hover:underline">Terms of Service</a>
              <a href="#" className="hover:underline">Contact Us</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}