"use client";
import {
  Users,
  BookOpen,
  Trophy,
  Lightbulb,
  Building2,
  ComputerIcon,
} from "lucide-react";

const Advantages = () => {
  const advantages = [
    {
      icon: <Building2 className="h-10 w-10 text-primary" />,
      title: "Pemerintahan Base",
      description:
        "Taught by leaders in their fields, our curriculum combines theoretical knowledge with practical experience and critical thinking.",
    },
    {
      icon: <ComputerIcon className="h-10 w-10 text-primary" />,
      title: "Fasilitas Lengkap",
      description:
        "Our diverse community of students and faculty from over 150 countries brings global perspectives and cultural awareness.",
    },
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: "Mentor Bersertifikat",
      description:
        "Our 31 colleges provide supportive, inclusive communities where students live, study, and socialize together.",
    },
    {
      icon: <BookOpen className="h-10 w-10 text-primary" />,
      title: "Penelitian Kampus",
      description:
        "Engage with cutting-edge research and innovation across disciplines, with opportunities for student involvement at all levels.",
    },
    {
      icon: <Trophy className="h-10 w-10 text-primary" />,
      title: "Karir di Kemenkeu",
      description:
        "Our graduates are highly sought after by employers worldwide, with a global network of over 200,000 alumni in leadership positions.",
    },
    {
      icon: <Lightbulb className="h-10 w-10 text-primary" />,
      title: "Nilai AKHLAK",
      description:
        "From the discovery of DNA's structure to advancements in artificial intelligence, we've led breakthroughs that change the world.",
    },
  ];

  return (
    <section className=" py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-bold text-3xl mb-5 mx-auto text-center">
            Kenapa harus memilih Kemenkeu ?
            <span className="block mx-auto mt-2 w-24 h-1 bg-primary"></span>
          </h2>
          <p className="section-subtitle mx-auto">
            Kemenkeu adalah Lembaga Kementerian yang memiliki lebih dari 50
            Expertise dan divisi
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {advantages.map((advantage, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="mb-6">{advantage.icon}</div>
              <h3 className="text-xl font-bold mb-4 text-primary">
                {advantage.title}
              </h3>
              <p className="text-gray-800 dark:text-gray-200">
                {advantage.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Advantages;
