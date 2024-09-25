"use client"

import { useState, useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text, Html } from '@react-three/drei'
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Menu, X, ArrowUp, ArrowDown, Minus } from 'lucide-react'

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
]

const poissonData = Array.from({ length: 20 }, (_, k) => ({
  k,
  probability: (Math.pow(2, k) * Math.exp(-2)) / factorial(k),
}))

function factorial(n: number): number {
  if (n === 0 || n === 1) return 1
  return n * factorial(n - 1)
}

function NetworkNode({ position, label }: { position: [number, number, number], label: string }) {
  const [hovered, setHovered] = useState(false)
  const meshRef = useRef()

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01
      meshRef.current.rotation.y += 0.01
    }
  })

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.1, 32, 32]} />
        <meshStandardMaterial color={hovered ? "red" : "blue"} />
      </mesh>
      <Text position={[0, 0.15, 0]} fontSize={0.1} color="white">
        {label}
      </Text>
      {hovered && (
        <Html distanceFactor={10}>
          <div className="bg-white text-black p-2 rounded shadow-lg">
            {label}
          </div>
        </Html>
      )}
    </group>
  )
}

function NetworkMap() {
  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      {networkData.map((node) => (
        <NetworkNode key={node.id} position={[node.x, node.y, node.z]} label={node.id} />
      ))}
      <OrbitControls />
    </Canvas>
  )
}

function TicketHistogram() {
  return (
    <BarChart width={500} height={300} data={ticketData}>
      <XAxis dataKey="node" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="high" stackId="a" fill="#ff0000" />
      <Bar dataKey="medium" stackId="a" fill="#ffff00" />
      <Bar dataKey="low" stackId="a" fill="#00ff00" />
    </BarChart>
  )
}

function PoissonDistribution() {
  return (
    <LineChart width={500} height={300} data={poissonData}>
      <XAxis dataKey="k" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="probability" stroke="#8884d8" />
    </LineChart>
  )
}

function VulnerabilityAnalysis() {
  const vulnerabilityData = [
    { name: 'Unpatched Systems', status: 'increase', change: 5 },
    { name: 'Weak Passwords', status: 'decrease', change: 3 },
    { name: 'Misconfigured Firewalls', status: 'neutral', change: 0 },
    { name: 'Outdated Software', status: 'increase', change: 2 },
    { name: 'Unsecured APIs', status: 'decrease', change: 1 },
  ]

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
      <h3 className="text-lg font-semibold mb-4">Vulnerability Analysis</h3>
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

function IncomingTickets() {
  const [tickets, setTickets] = useState<{ id: number; title: string; description: string; priority: string; timestamp: string }[]>([])
  const ticketContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const priorities = ['Low', 'Medium', 'High', 'Critical']
    const ticketTitles = [
      'Server Down',
      'Network Latency',
      'Database Error',
      'Security Breach',
      'Application Crash',
      'API Failure',
      'User Authentication Issue',
      'Data Corruption',
      'Memory Leak',
      'Disk Space Warning'
    ]
    const descriptions = [
      'User experiencing frequent disconnections',
      'Slow response times across multiple services',
      'Unable to read or write to database',
      'Unusual access patterns detected',
      'Application terminating unexpectedly',
      'API endpoints returning 500 errors',
      'Users unable to log in',
      'Data integrity issues detected',
      'System resources depleting rapidly',
      'Storage capacity reaching critical levels'
    ]

    const addTicket = () => {
      const newTicket = {
        id: Date.now(),
        title: ticketTitles[Math.floor(Math.random() * ticketTitles.length)],
        description: descriptions[Math.floor(Math.random() * descriptions.length)],
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        timestamp: new Date().toLocaleTimeString()
      }
      setTickets(prevTickets => [newTicket, ...prevTickets].slice(0, 50))
    }

    const intervalId = setInterval(addTicket, 5000)

    return () => clearInterval(intervalId)
  }, [])

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

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <nav className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="font-bold text-xl">Incident Analytics</span>
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
        <h1 className="text-3xl font-bold mb-6">Incident Analytics Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Network Map</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <NetworkMap />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Ticket Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <TicketHistogram />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Incident Rate (Poisson Distribution)</CardTitle>
            </CardHeader>
            <CardContent>
              <PoissonDistribution />
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
            <IncomingTickets />
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p>&copy; 2023 Incident Analytics. All rights reserved.</p>
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