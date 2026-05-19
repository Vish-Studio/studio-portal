import TemplateShell from '../../components/document/template-shell';
import ProjectTemplateDocument from '../../components/document/project-template-document';
import { getDefaultBlocks } from '../../templateBlocks';

export default function ProjectProposalTemplatePage() {
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
