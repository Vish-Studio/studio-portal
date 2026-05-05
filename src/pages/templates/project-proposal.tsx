import TemplateShell from '../../components/admin/templates/template-shell';
import ProjectTemplateDocument from '../../components/admin/templates/project-template-document';
import { getDefaultBlocks } from '../../data/template-blocks';

export default function ProjectProposalTemplate() {
  return (
    <TemplateShell title="Project Proposal">
      <ProjectTemplateDocument
        slug="project-proposal"
        title="Project Proposal"
        blocks={getDefaultBlocks('project-proposal')}
      />
    </TemplateShell>
  );
}
