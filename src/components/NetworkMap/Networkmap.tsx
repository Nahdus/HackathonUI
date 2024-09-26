"use client"
import { useState, useEffect, useRef } from 'react'
import {  Text, Html } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three';

// networkMap,
// nodeCordinate,
// nodeAttributes
const ScalingFactor = 2.0

function NetworkEdges({startPosition,endPosition}:{startPosition:[number,number], endPosition:[number,number]}){
  let startPoint = new THREE.Vector3(startPosition[0],startPosition[1],0).multiplyScalar(ScalingFactor)
  let endPoint = new THREE.Vector3(endPosition[0],endPosition[1],0).multiplyScalar(ScalingFactor)
  let distance =  startPoint.distanceTo(endPoint)
  const midPoint = new THREE.Vector3().addVectors(startPoint, endPoint).multiplyScalar(0.5);
  const direction = new THREE.Vector3().subVectors(endPoint, startPoint).normalize();
  const axis = new THREE.Vector3(0, 1, 0);
  const quaternion = new THREE.Quaternion().setFromUnitVectors(axis, direction);
  return(

  <group position={midPoint}>
    <mesh quaternion={quaternion} renderOrder={0}>
      <planeGeometry args={[0.1,distance]}/>
      <meshBasicMaterial color={0xFFBF00} />          
    </mesh>
    </group>
  )
}


function NetworkNode({ position, label, health, type }: { position: [number, number, number], label: string, health:number, type:string }) {

  const [hovered, setHovered] = useState(false)
  const meshRef = useRef()

  const colorRed =0xD2222D
  const colorAmber = 0xFFBF00
  const colorGreen = 0x238823
  let radius = 0.3
  let nodeColor = colorGreen
  let _health = health
  if ((0<=_health && _health<30)){
    nodeColor = colorRed
  }
  if ((30<=_health && _health<70)){
    nodeColor = colorAmber
  }
  if ((70<=_health  && _health<=100)){
    nodeColor = colorGreen
  }
  if(type == "hub" ){
    radius=0.5
  }else if(type == "ordinary"){
    radius = 0.3
  }
  let coordinate = new THREE.Vector3(position[0], position[1], 0)
  coordinate.multiplyScalar(ScalingFactor)
    return (
      <group position={coordinate}>
        <mesh renderOrder={1} ref={meshRef} onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}>
          <circleGeometry args={[radius,32]}/>
          <meshBasicMaterial color={nodeColor} />          
        </mesh>
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


function DrawNetworkEdge({networkMap,nodeCordinate}:{networkMap:any,nodeCordinate:any}){
  let edges:any = []
  let visited:string[] = []
  Object.keys(networkMap).forEach(nodeId=>{
    if (visited.indexOf(nodeId) == -1){
      let startcord = nodeCordinate[nodeId]
      visited.push(nodeId)
      networkMap[nodeId].forEach((endNodeId:string)=>{
        if(visited.indexOf(endNodeId)==-1){
          let endcord = nodeCordinate[endNodeId]
          edges.push(<NetworkEdges startPosition={startcord} endPosition={endcord} key={nodeId+endNodeId}/>)
        }
      })

    }
    
  })
  return edges
}




function NetworkMap({networkDetails}:any) {
  let networkMap = networkDetails.networkMap
  let nodeCordinate = networkDetails.nodeCordinate
  let nodeAttributes = networkDetails.nodeAttributes
  console.log(networkDetails)
    return (
      <Canvas camera={{ position: [0, 0, 5] }}>

        {Object.keys(networkMap).map((nodeId:any) => (
          <NetworkNode key={nodeId} position={[nodeCordinate[nodeId][0], nodeCordinate[nodeId][1],0]} label={nodeId.substring(0,4)} health={nodeAttributes[nodeId]["health"]} type = {nodeAttributes[nodeId]["nodeType"]}/>
        ))}
        {DrawNetworkEdge({networkMap,nodeCordinate})}
        
        <perspectiveCamera position={[0, 0, 5]}></perspectiveCamera>
      </Canvas>
    )
  }

  export default NetworkMap