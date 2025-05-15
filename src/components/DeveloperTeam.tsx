
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TeamMember {
  name: string;
  role: string;
  avatar: string;
  bio: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "Rasindu Vimansha Illangrarathne",
    role: "Backend Architect",
    avatar: "AC",
    bio: "Specializes in AI-driven threat detection and cybersecurity, with expertise in phishing prevention, DDoS simulation, and advanced threat response."
  },
  {
    name: "Sarah Johnson",
    role: "ML Engineer",
    avatar: "SJ",
    bio: "Machine learning expert focusing on NLP models for phishing detection. PhD in Computer Science with specialization in adversarial machine learning."
  },
  {
    name: "Michael Rodriguez",
    role: "Frontend Developer",
    avatar: "MR",
    bio: "Full-stack developer with expertise in building secure, responsive interfaces. Passionate about creating intuitive security tools for non-technical users."
  },
  {
    name: "Priya Patel",
    role: " UI/UX Designer",
    avatar: "PP",
    bio: "Systems architect specialized in high-throughput security processing pipelines. Previously built email security systems at Proofpoint."
  }
];

export function DeveloperTeam() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Meet the Team</h2>
      <p className="text-muted-foreground">
        Our expert developers are committed to building cutting-edge solutions to keep your organization safe from evolving email threats.
      </p>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {teamMembers.map((member) => (
          <Card key={member.name} className="overflow-hidden">
            <div className="bg-primary/10 p-6 flex justify-center">
              <Avatar className="h-24 w-24">
                <AvatarImage src={`/placeholder.svg`} alt={member.name} />
                <AvatarFallback className="text-xl bg-primary text-primary-foreground">{member.avatar}</AvatarFallback>
              </Avatar>
            </div>
            <CardHeader className="pt-4 pb-2">
              <CardTitle>{member.name}</CardTitle>
              <CardDescription>{member.role}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{member.bio}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
