import TemplateShell from '../../components/admin/templates/template-shell';
import ProjectTemplateDocument from '../../components/admin/templates/project-template-document';
import { getDefaultBlocks } from '../../data/template-blocks';

export default function InvoiceTemplate() {
  return (
    <TemplateShell title="Invoice">
      <ProjectTemplateDocument
        slug="invoice"
        title="Invoice"
        blocks={getDefaultBlocks('invoice')}
      />
    </TemplateShell>
  );
}
