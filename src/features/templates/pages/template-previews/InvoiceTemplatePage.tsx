import TemplateShell from '../../components/document/template-shell';
import ProjectTemplateDocument from '../../components/document/project-template-document';
import { getDefaultBlocks } from '../../templateBlocks';

export default function InvoiceTemplatePage() {
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
