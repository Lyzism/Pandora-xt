import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import Settings from './components/tab/Settings'
import Chat from './components/tab/Chat'
import OpenFile from './components/tab/OpenFile'
import UploadFile from './components/tab/UploadFile'

export default function Component() {
  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-center text-2xl font-bold mb-4">PANDORA Beta</h2>
      <Tabs defaultValue="open" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="upload">Upload File</TabsTrigger>
          <TabsTrigger value="open">Open File</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="upload" className="space-y-4">
          <UploadFile />
        </TabsContent>
        <TabsContent value="open" className="space-y-4">
          <OpenFile />
        </TabsContent>
        <TabsContent value="chat" className="space-y-4">
          <Chat />
        </TabsContent>
        <TabsContent value="settings" className="space-y-4">
          <Settings />
        </TabsContent>
      </Tabs>
    </div>
  )
}