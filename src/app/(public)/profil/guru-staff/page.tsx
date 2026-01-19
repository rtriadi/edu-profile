import { Metadata } from "next";
import Image from "next/image";
import { Users, GraduationCap, Mail } from "lucide-react";


import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { prisma } from "@/lib/prisma";
import { getInitials } from "@/lib/utils";

// Dynamic rendering - fetch fresh data on each request
// This prevents build-time database errors on Vercel
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Guru & Staff",
  description: "Kenali guru dan staff sekolah kami",
};

async function getStaffData() {
  try {
    const [leadership, teachers, staff] = await Promise.all([
      prisma.staff.findMany({
        where: { isActive: true, department: "Pimpinan" },
        orderBy: { order: "asc" },
      }),
      prisma.staff.findMany({
        where: { isActive: true, isTeacher: true, NOT: { department: "Pimpinan" } },
        orderBy: { order: "asc" },
      }),
      prisma.staff.findMany({
        where: { isActive: true, isTeacher: false, NOT: { department: "Pimpinan" } },
        orderBy: { order: "asc" },
      }),
    ]);

    return { leadership, teachers, staff };
  } catch (error) {
    console.error("Error fetching staff data:", error);
    return { leadership: [], teachers: [], staff: [] };
  }
}

export default async function GuruStaffPage() {
  const { leadership, teachers, staff } = await getStaffData();

  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Guru & Staff</h1>
          <p className="text-primary-foreground/80">
            Kenali para pendidik dan tenaga kependidikan kami
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Leadership */}
        {leadership.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              Pimpinan Sekolah
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {leadership.map((person) => (
                <StaffCard key={person.id} person={person} />
              ))}
            </div>
          </section>
        )}

        {/* Tabs for Teachers and Staff */}
        <Tabs defaultValue="teachers">
          <TabsList className="mb-6">
            <TabsTrigger value="teachers" className="gap-2">
              <GraduationCap className="h-4 w-4" />
              Guru ({teachers.length})
            </TabsTrigger>
            <TabsTrigger value="staff" className="gap-2">
              <Users className="h-4 w-4" />
              Staff ({staff.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="teachers">
            {teachers.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">
                Belum ada data guru
              </p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {teachers.map((person) => (
                  <StaffCard key={person.id} person={person} compact />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="staff">
            {staff.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">
                Belum ada data staff
              </p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {staff.map((person) => (
                  <StaffCard key={person.id} person={person} compact />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}

interface StaffCardProps {
  person: {
    id: string;
    name: string;
    position: string;
    department: string | null;
    photo: string | null;
    email: string | null;
    phone: string | null;
    bio: string | null;
    education: string | null;
    isTeacher: boolean;
    subjects: unknown;
  };
  compact?: boolean;
}

function StaffCard({ person, compact = false }: StaffCardProps) {
  const subjects = person.subjects as string[] | null;

  if (compact) {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="aspect-square relative bg-muted">
          {person.photo ? (
            <Image
              src={person.photo}
              alt={person.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-primary/10">
              <span className="text-4xl font-bold text-primary">
                {getInitials(person.name)}
              </span>
            </div>
          )}
        </div>
        <CardContent className="p-4 text-center">
          <h3 className="font-semibold">{person.name}</h3>
          <p className="text-sm text-muted-foreground">{person.position}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="md:flex">
        <div className="md:w-1/3 aspect-square relative bg-muted">
          {person.photo ? (
            <Image
              src={person.photo}
              alt={person.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-primary/10">
              <span className="text-5xl font-bold text-primary">
                {getInitials(person.name)}
              </span>
            </div>
          )}
        </div>
        <CardContent className="p-6 md:w-2/3">
          <h3 className="text-xl font-semibold mb-1">{person.name}</h3>
          <p className="text-primary font-medium mb-2">{person.position}</p>
          
          {person.education && (
            <p className="text-sm text-muted-foreground mb-2">
              {person.education}
            </p>
          )}

          {subjects && subjects.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {subjects.map((subject, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {subject}
                </Badge>
              ))}
            </div>
          )}

          {person.bio && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {person.bio}
            </p>
          )}

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {person.email && (
              <a href={`mailto:${person.email}`} className="flex items-center gap-1 hover:text-primary">
                <Mail className="h-4 w-4" />
                Email
              </a>
            )}
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
