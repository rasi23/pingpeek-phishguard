
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
    name: "RASINDU ILLANGRATHNE",
    role: "Lead Security Researcher",
    avatar: "AC",
    bio: "Specializes in AI-powered threat detection with 10+ years in cybersecurity."
  },
  {
    name: "VIRANGA THULSHAN ",
    role: "ML Engineer",
    avatar: "SJ",
    bio: "Machine learning expert focusing on NLP models for phishing detection."
  },
  {
    name: "ERICA DILSHANI",
    role: "Frontend Developer",
    avatar: "MR",
    bio: "Full-stack developer with expertise in building secure, responsive interfaces."
  },
  {
    name: "ASHINI NANAYAKKARA",
    role: "Backend Architect",
    avatar: "PP",
    bio: "Systems architect specialized in high-throughput security processing pipelines."
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
