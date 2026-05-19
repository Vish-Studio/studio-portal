import TemplateShell from '../../components/document/template-shell';
import ProjectTemplateDocument from '../../components/document/project-template-document';
import { getDefaultBlocks } from '../../templateBlocks';

export default function OverdueInvoiceTemplatePage() {
  return (
    <TemplateShell title="Overdue Invoice">
      <ProjectTemplateDocument
        slug="overdue-invoice"
        title="Overdue Invoice"
        blocks={getDefaultBlocks('overdue-invoice')}
      />
    </TemplateShell>
  );
}
