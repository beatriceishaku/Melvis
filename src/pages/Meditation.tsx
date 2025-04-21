
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, BookOpen } from "lucide-react";

interface MeditationVideo {
  id: number;
  title: string;
  description: string;
  duration: string;
  embedId: string;
  category: string;
}

const meditationVideos: MeditationVideo[] = [
  {
    id: 1,
    title: "Morning Calm Meditation",
    description: "Start your day with this 10-minute guided meditation for clarity and calm.",
    duration: "10:15",
    embedId: "O-6f5wQXSu8",
    category: "Morning",
  },
  {
    id: 2,
    title: "Stress Relief Meditation",
    description: "Release tension and anxiety with this gentle guided practice.",
    duration: "15:30",
    embedId: "z6X5oEIg6Ak",
    category: "Stress Relief",
  },
  {
    id: 3,
    title: "Sleep Well Meditation",
    description: "Prepare your mind for restful sleep with this relaxing meditation.",
    duration: "20:45",
    embedId: "aEqlQvczMVQ",
    category: "Evening",
  },
  {
    id: 4,
    title: "5-Minute Mindfulness Break",
    description: "A quick reset for your mind during a busy day.",
    duration: "5:10",
    embedId: "inpok4MKVLM",
    category: "Quick Break",
  },
  {
    id: 5,
    title: "Nature Sounds Meditation",
    description: "Connect with the calming sounds of nature to ground yourself.",
    duration: "12:20",
    embedId: "1ZYbU82GVz4",
    category: "Nature",
  },
  {
    id: 6,
    title: "Morning Energy Meditation",
    description: "Energize your day with this uplifting morning practice.",
    duration: "8:45",
    embedId: "ENYYb5vIMkU",
    category: "Morning",
  },
];

const Meditation = () => {
  const [activeVideo, setActiveVideo] = useState<MeditationVideo | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [filter, setFilter] = useState("All");

  const categories = ["All", ...Array.from(new Set(meditationVideos.map(video => video.category)))];
  
  const filteredVideos = filter === "All" 
    ? meditationVideos 
    : meditationVideos.filter(video => video.category === filter);

  return (
    <Layout>
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-blue-800">Morning Meditation</h1>
          <p className="text-xl text-blue-600">
            Start your day with intention through these guided meditation practices
          </p>
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((category) => (
            <Button
              key={category}
              variant={filter === category ? "default" : "outline"}
              onClick={() => setFilter(category)}
              className="mb-2"
            >
              {category}
            </Button>
          ))}
        </div>
        
        {activeVideo && (
          <Card className="bg-blue-50 border-blue-200 overflow-hidden">
            <div className="aspect-video w-full">
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo.embedId}?autoplay=${isPlaying ? 1 : 0}`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
            <CardHeader>
              <CardTitle className="text-blue-700 flex justify-between items-center">
                {activeVideo.title}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
              </CardTitle>
              <CardDescription>{activeVideo.description}</CardDescription>
            </CardHeader>
          </Card>
        )}
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <Card 
              key={video.id}
              className={`hover:shadow-lg transition-shadow cursor-pointer ${
                activeVideo?.id === video.id ? "ring-2 ring-blue-500" : ""
              }`}
              onClick={() => {
                setActiveVideo(video);
                setIsPlaying(true);
              }}
            >
              <div className="relative">
                <img
                  src={`https://img.youtube.com/vi/${video.embedId}/hqdefault.jpg`}
                  alt={video.title}
                  className="w-full h-40 object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-20 transition-opacity">
                  <Play className="h-12 w-12 text-white" />
                </div>
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 text-sm rounded">
                  {video.duration}
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-blue-700">{video.title}</CardTitle>
                <CardDescription>{video.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Benefits of Regular Meditation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>Reduces stress and anxiety</li>
              <li>Improves focus and concentration</li>
              <li>Enhances self-awareness</li>
              <li>Promotes emotional health and well-being</li>
              <li>Helps with better sleep quality</li>
              <li>Can decrease blood pressure and heart rate</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Meditation;
