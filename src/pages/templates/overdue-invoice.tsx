import TemplateShell from '../../components/admin/templates/template-shell';
import ProjectTemplateDocument from '../../components/admin/templates/project-template-document';
import { getDefaultBlocks } from '../../data/template-blocks';

export default function OverdueInvoiceTemplate() {
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
