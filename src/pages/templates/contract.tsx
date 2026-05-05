import TemplateShell from '../../components/admin/templates/template-shell';
import ProjectTemplateDocument from '../../components/admin/templates/project-template-document';
import { getDefaultBlocks } from '../../data/template-blocks';

export default function ContractTemplate() {
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
