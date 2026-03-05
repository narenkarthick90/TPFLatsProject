import { useProjects, useCreateProject } from "@/hooks/use-projects";
import { Link } from "wouter";
import { Plus, Search, Terminal } from "lucide-react";
import { useState } from "react";

export default function Projects() {

  const { data: projects, isLoading } = useProjects();
  const createProject = useCreateProject();

  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState("");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Terminal className="h-12 w-12 text-primary animate-pulse" />
      </div>
    );
  }

  const filteredProjects = projects?.filter((p: any) =>
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.techStack?.some((t: string) =>
      t.toLowerCase().includes(search.toLowerCase())
    )
  );

  // ========================
  // CREATE PROJECT FUNCTION
  // ========================
  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();

    const fd = new FormData(e.currentTarget);

    const data = {
      title: fd.get("title") as string,
      description: fd.get("description") as string,
      techStack: (fd.get("techStack") as string)
        ?.split(",")
        .map((s) => s.trim()),
      skillsRequired: (fd.get("skillsRequired") as string)
        ?.split(",")
        .map((s) => s.trim()),
      collaboratorsNeeded: Number(fd.get("collaboratorsNeeded")),
      projectType: fd.get("projectType") as string,
      duration: fd.get("duration") as string,
      contactInfo: fd.get("contactInfo") as string,
    };

    createProject.mutate(data, {
      onSuccess: () => {
        setShowCreate(false);
      },
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-display text-foreground border-l-4 border-primary pl-4 uppercase">
            Project Hub
          </h1>
          <p className="text-muted-foreground mt-2 pl-5 font-mono">
            Discover and join active systems.
          </p>
        </div>

        <button
          onClick={() => setShowCreate(true)}
          className="bg-primary text-background px-6 py-3 font-bold font-display uppercase tracking-wider brutal-shadow hover:bg-white hover:text-black transition-all flex items-center gap-2"
        >
          <Plus className="h-5 w-5" /> Initialize Project
        </button>
      </div>

      {/* SEARCH */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary h-5 w-5" />
        <input
          type="text"
          placeholder="QUERY PROJECTS OR TECH STACK..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-background border-2 border-primary/30 p-4 pl-12 text-primary font-mono placeholder:text-primary/40 focus:outline-none focus:border-primary focus:brutal-shadow transition-all rounded-none"
        />
      </div>

      {/* CREATE PROJECT MODAL */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-card border-2 border-primary p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto brutal-shadow">

            <h2 className="text-2xl font-display text-primary uppercase mb-6 border-b-2 border-primary/20 pb-4">
              Initialize New Project
            </h2>

            <form onSubmit={handleCreate} className="space-y-4 font-mono">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground uppercase">
                    Project Title
                  </label>
                  <input name="title" required className="w-full bg-background border border-primary/30 p-3 text-foreground focus:outline-none focus:border-primary transition-all" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground uppercase">
                    Type
                  </label>
                  <input name="projectType" required className="w-full bg-background border border-primary/30 p-3 text-foreground focus:outline-none focus:border-primary transition-all" />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm text-muted-foreground uppercase">
                    Description
                  </label>
                  <textarea name="description" required rows={3} className="w-full bg-background border border-primary/30 p-3 text-foreground focus:outline-none focus:border-primary transition-all" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground uppercase">
                    Tech Stack
                  </label>
                  <input name="techStack" required placeholder="React, Node, PostgreSQL" className="w-full bg-background border border-primary/30 p-3 text-foreground focus:outline-none focus:border-primary transition-all" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground uppercase">
                    Skills Required
                  </label>
                  <input name="skillsRequired" required placeholder="Frontend, UI/UX" className="w-full bg-background border border-primary/30 p-3 text-foreground focus:outline-none focus:border-primary transition-all" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground uppercase">
                    Collaborators Needed
                  </label>
                  <input name="collaboratorsNeeded" type="number" min="1" required className="w-full bg-background border border-primary/30 p-3 text-foreground focus:outline-none focus:border-primary transition-all" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground uppercase">
                    Duration
                  </label>
                  <input name="duration" required placeholder="3 weeks" className="w-full bg-background border border-primary/30 p-3 text-foreground focus:outline-none focus:border-primary transition-all" />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm text-muted-foreground uppercase">
                    Contact Info
                  </label>
                  <input name="contactInfo" required placeholder="Discord or Email" className="w-full bg-background border border-primary/30 p-3 text-foreground focus:outline-none focus:border-primary transition-all" />
                </div>

              </div>

              <div className="flex justify-end gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="px-6 py-2 border border-primary/50 text-muted-foreground hover:text-foreground hover:border-primary transition-all uppercase tracking-wider"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={createProject.isPending}
                  className="px-6 py-2 bg-primary text-background font-bold hover:bg-white transition-all brutal-shadow uppercase tracking-wider disabled:opacity-50"
                >
                  {createProject.isPending ? "Deploying..." : "Deploy Project"}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* PROJECT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">

        {filteredProjects?.map((project: any, i: number) => (

          <Link key={project.id} href={`/projects/${project.id}`} className="group block">

            <div
              className="h-full border-2 border-primary/20 bg-card p-6 transition-all duration-300 group-hover:border-primary brutal-shadow-hover relative overflow-hidden"
              style={{ animationDelay: `${i * 100}ms` }}
            >

              <div className="absolute top-0 right-0 bg-primary/10 text-primary border-l-2 border-b-2 border-primary/20 px-3 py-1 text-xs font-mono font-bold">
                {project.projectType}
              </div>

              <h3 className="text-2xl font-display text-foreground mb-3 pr-16 truncate">
                {project.title}
              </h3>

              <p className="text-muted-foreground text-sm line-clamp-2 mb-6 font-mono">
                {project.description}
              </p>

              <div className="space-y-4">

                <div>

                  <div className="text-xs text-primary/60 uppercase mb-2">
                    Stack
                  </div>

                  <div className="flex flex-wrap gap-2">

                    {(project.techStack || []).slice(0,3).map((tech: string) => (
                      <span key={tech} className="bg-background border border-primary/30 px-2 py-1 text-xs text-primary font-mono">
                        {tech}
                      </span>
                    ))}

                    {(project.techStack || []).length > 3 && (
                      <span className="bg-background border border-primary/30 px-2 py-1 text-xs text-muted-foreground font-mono">
                        +{project.techStack.length - 3}
                      </span>
                    )}

                  </div>

                </div>

                <div className="flex justify-between items-end border-t border-primary/10 pt-4 mt-4">

                  <div className="text-xs text-muted-foreground">
                    <span className="text-foreground">
                      {project.collaboratorsNeeded}
                    </span>{" "}
                    needed
                  </div>

                  <div className="text-xs text-primary font-bold tracking-widest">
                    VIEW DATA_
                  </div>

                </div>

              </div>

            </div>

          </Link>

        ))}

        {filteredProjects?.length === 0 && (
          <div className="col-span-full border-2 border-dashed border-primary/20 p-12 text-center text-muted-foreground font-mono">
            NO SYSTEMS MATCH YOUR QUERY.
          </div>
        )}

      </div>

    </div>
  );
}