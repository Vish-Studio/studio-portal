import TemplateShell from '../../components/document/template-shell';
import ProjectTemplateDocument from '../../components/document/project-template-document';
import { getDefaultBlocks } from '../../templateBlocks';

export default function QuotationTemplatePage() {
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
