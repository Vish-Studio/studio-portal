import TemplateShell from '../../components/admin/templates/template-shell';
import ProjectTemplateDocument from '../../components/admin/templates/project-template-document';
import { getDefaultBlocks } from '../../data/template-blocks';

export default function QuotationTemplate() {
  return (
    <TemplateShell title="Quotation">
      <ProjectTemplateDocument
        slug="quotation"
        title="Quotation"
        blocks={getDefaultBlocks('quotation')}
      />
    </TemplateShell>
  );
}
