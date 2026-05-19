import TemplateShell from '../../components/document/template-shell';
import ProjectTemplateDocument from '../../components/document/project-template-document';
import { getDefaultBlocks } from '../../templateBlocks';

export default function ContractTemplatePage() {
  return (
    <TemplateShell title="Contract">
      <ProjectTemplateDocument
        slug="contract"
        title="Contract"
        blocks={getDefaultBlocks('contract')}
      />
    </TemplateShell>
  );
}
