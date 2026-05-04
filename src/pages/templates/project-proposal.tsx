import TemplateShell, {
  DocDivider, SectionHeading, BodyText,
} from '../../components/admin/templates/template-shell';
import TemplateFooter from './template-footer/template-footer';
import TemplateHeader from './template-header/template-header';

const OBJECTIVES = [
  'The main objective is to simplify financial management for the user by providing a single platform for budgeting, saving, and investing.',
  'The app should aim to provide users with the information and tools they need to make informed financial decisions and reach their financial goals.',
  'By providing educational resources and personalized advice, the app can aim to improve the financial literacy of its users.',
];

const APPROACH = [
  'Gather information about the target audience to understand their financial behavior and preferences. This will help inform the design of the app and ensure it meets the needs of its users.',
  'Define the specific features and functionalities that the app will offer, including budgeting, saving, investing, and any other unique features that differentiate the app from others.',
  'Develop wireframes to define the overall structure and flow of the app. This will help you visualize the user experience and identify any potential pain points in the design.',
  'Create a visually appealing and user-friendly interface that aligns with the brand and the functionality defined in the wireframes.',
  'Conduct user testing to gather feedback and refine the design. This can involve prototypes, MVPs, or beta testing to ensure the app is functioning as intended and provides a positive user experience. Repeat the process until the app is polished and ready for launch.',
];

const TIMELINE = [
  { milestone: 'Design System', date: '15 Jan 2023' },
  { milestone: 'Wireframes', date: '15 Feb 2023' },
  { milestone: 'UI Design', date: '15 Mar 2023' },
  { milestone: 'Prototype', date: '15 Apr 2023' },
];

export default function ProjectProposalTemplate() {
  return (
    <TemplateShell title="Project Proposal">
      <div className="px-14 py-12">

        <TemplateHeader
          title='Proposal'
          clientInfo={
            {
              name: 'Client Name',
              email: 'client@email.com',
              city: 'City',
              country: 'Mauritius'
            }}
        />

        {/* ── About Project ── */}
        <div className="mb-10">
          <SectionHeading>About Project</SectionHeading>
          <BodyText>
            We aim to empower users with the tools they need to make informed financial decisions and
            reach their financial goals. With features such as real-time spending tracking, personalised
            savings plans, and investment portfolios, our app will provide a comprehensive solution for all of a
            user's financial needs. We are confident that our app will make a meaningful impact in the fintech
            industry, and we are eager to bring this innovative solution to market.
          </BodyText>
        </div>

        <DocDivider className="mb-10" />

        {/* ── Objective ── */}
        <div className="mb-10">
          <SectionHeading>Objective</SectionHeading>
          <ol className="space-y-3">
            {OBJECTIVES.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-[13px] text-gray-700 leading-relaxed">
                <span className="shrink-0 font-bold text-gray-400 mt-0.5">{i + 1}.</span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </div>

        <DocDivider className="mb-10" />

        {/* ── Approach ── */}
        <div className="mb-10">
          <SectionHeading>Approach</SectionHeading>
          <ol className="space-y-4">
            {APPROACH.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-[13px] text-gray-700 leading-relaxed">
                <span className="shrink-0 font-bold text-gray-400 mt-0.5">{i + 1}.</span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </div>

        <DocDivider className="mb-10" />

        {/* ── Timeline ── */}
        <div className="mb-10">
          <SectionHeading>Timeline</SectionHeading>

          {/* Track line */}
          <div className="relative mb-8 mt-4">
            <div className="absolute top-[7px] left-0 right-0 h-px bg-gray-800" />
            <div className="grid grid-cols-4 gap-4 relative">
              {TIMELINE.map((item, i) => (
                <div key={i}>
                  <div className="w-3.5 h-3.5 rounded-full bg-gray-800 mb-3 relative z-10" />
                  <p className="text-[13px] font-semibold text-gray-800">{item.milestone}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{item.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DocDivider className="mb-10" />

        {/* ── Benefits ── */}
        <div className="mb-10">
          <SectionHeading>Benefits for You</SectionHeading>
          <BodyText>
            Focusing on good quality design for a fintech app has several benefits including improved user
            experience, enhanced brand identity, boosted user trust, and increased adoption. A well-designed
            app with an intuitive interface and user-centered experience will make the app more enjoyable and
            appealing to use, leading to higher engagement and user satisfaction. A visually appealing and
            easy-to-use app instills confidence and trust in users, encouraging them to share sensitive
            financial information and use the app for their financial needs. By creating a positive user
            experience, reinforcing the brand identity, and encouraging adoption, a focus on good quality
            design is essential for creating a successful fintech app.
          </BodyText>
        </div>

        <DocDivider className="mb-8" />

        {/* ── Footer ── */}
        <TemplateFooter />

      </div>
    </TemplateShell>
  );
}
