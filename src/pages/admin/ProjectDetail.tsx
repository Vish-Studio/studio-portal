import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Layout from '../../components/layout/layout';
import ProjectCard from '../../components/project-card/project-card';
import { DEMO_PROJECTS } from '../../data/projects';

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const project = DEMO_PROJECTS.find(p => p.id === id);

  if (!project) {
    return (
      <Layout title="Project">
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <p className="text-gray-500 font-medium">Project not found.</p>
          <Link to="/admin/projects" className="text-sm font-semibold text-gray-900 underline underline-offset-4">
            Back to Projects
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={project.name}>
      <div className="pb-12">
        <div className="flex items-center gap-3 mb-6">
          <Link
            to="/admin/projects"
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-400 hover:text-gray-800 hover:border-gray-400 transition-colors shrink-0"
          >
            <ArrowLeft size={15} />
          </Link>
          <span className="text-sm text-gray-400 font-medium">Projects</span>
          <span className="text-gray-200">/</span>
          <span className="text-sm font-semibold text-gray-700 truncate">{project.name}</span>
        </div>

        <ProjectCard project={project} />
      </div>
    </Layout>
  );
};

export default ProjectDetail;
