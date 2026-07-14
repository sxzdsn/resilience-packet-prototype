window.RESILIENCE_PREFACE = {
  orientation: {
    title: "You are the boss of your own body and care.",
    cards: [
      { text: "You have rights as a teen, we’ll walk you through them." },
      { text: "You may be feeling a lot of emotions.", detail: "They’re all valid and there are practical and healthy ways to process them. We’re here to help." },
      { text: "We maintain absolute confidentiality with you." },
      { text: "You will not be directly billed for medical care related to your assault.", detail: "This is the law in Illinois." },
      { brand: "RESILIENCE", text: "We are an organization called Resilience.", detail: "We’ve got your back." },
    ],
    footnote: "The only exception to confidentiality is if you are in immediate danger of hurting yourself or others.",
  },
  letter: {
    salutation: "Hello,",
    paragraphs: [
      "If you are reading this, you or a teen you care about may have experienced sexual violence. Your experience is valid and real. What happened is not your fault, and there are many resources and options available to you.",
      "This packet is a resource for you or your loved one(s). It contains information about your legal rights and options, medical treatments you can access, and emotional supports that are available. All survivors have the same rights and protections, but not everything in the packet will necessarily apply to you. Everyone’s experience is different; trust yourself and whatever options feel right for you.",
      "However you choose to heal, we support you and wish you the best.",
    ],
    signoff: "Sincerely,",
    organization: "Resilience",
    notes: [
      "Resilience is an independent, not-for-profit organization that offers sexual assault survivors free and confidential legal advocacy, medical advocacy, and trauma therapy services in English and Spanish.",
      "We welcome your feedback on any experiences you have with our advocates in the hospital. If you would like to share your experience, you may do so by completing this brief survey: www.ourresilience.org/clientevaluation.",
      "Reach out for more information or to request services. Please note that this isn’t a hotline and we will respond to messages Mon through Fri, 9am to 5pm",
    ],
    contacts: ["ourresilience.org", "312-443-9603", "info@ourresilience.org"],
  },
  contents: {
    title: "In this packet",
    items: [
      { title: "Caregiver Information", description: "Information and resources for caretakers of teen survivors of sexual assault." },
      { title: "About Resilience", description: "Who is Resilience, and what is an advocate?" },
      { title: "Navigating Emotions", description: "Understanding your feelings (and what to do with them) after an assault." },
      { title: "Hospital Visit", description: "Your legal rights in the ER, information on billing, medications, pregnancy, the evidence collection kit, and more." },
      { title: "Legal Process", description: "What does the criminal legal process look like, accessing restraining orders, navigating immigration questions, and more." },
      { title: "School and work", description: "Your rights and how to talk (only if you want!) about your assault with your school or workplace." },
      { title: "Minors Rights, Consent, and Sexual Assault", description: "______________________________." },
      { title: "Housing and DCFS", description: "What your options are if you’re in need of safe housing - and what DCFS is all about." },
      { title: "FAQs and Related Resources", description: "Questions that teens like you ask, and resources to learn more." },
    ],
  },
};

window.RESILIENCE_PACKET_SOURCE = `
  <h1>Caregiver Information</h1>
  <h2>Caring for your teen</h2>
  <p>Supporting your teen after an assault means prioritizing their safety and helping them regain a sense of empowerment. It is important to use honest, age-appropriate language and clearly remind them that the assault was absolutely not their fault. Let them know that experiencing a wide mix of emotions and trauma reactions is completely normal.</p>
  <p>To help your family through this, Resilience advocates are available for free to provide crisis counseling, help you talk to hospital staff or schools, assist with immediate needs, and, if needed, navigate the criminal legal process.</p>
  <p>All survivors have the same rights and protections, but not everything here will necessarily apply to you or your teen. Everyone’s experience is different; trust yourself and whatever options feel right for you.</p>
  <h2>Your teen’s rights and options</h2>
  <p>Your teen has strict rights to privacy, safety, and specialized medical care in the emergency room which are covered in this packet. Your teen holds autonomy over their own choices; they can choose which parts of the medical exam to complete, track their evidence kit online, choose not to speak with the police, and even consent to their own counseling. As a parent or guardian - this may feel strange. You’re used to being involved and making decisions for your teen, and that makes sense! However science shows that after an assault, restoring agency and empowerment is critical.</p>
  <p>See specific rights and citations in ‘Minors Rights, Consent, and Sexual Assault’</p>
  <p>Go the ‘Hospital Visit’ section for ____________________.</p>
  <h2>Caring for yourself</h2>
  <p>It’s normal to feel overwhelmed, but you do not have to carry this heavy burden alone. Free trauma therapy, case management, and support are available for both your teen and your family through Resilience and the YWCA RISE Children's Center.</p>
  <p>You can also reach out to legal advocates at Resilience who can explain your rights, help you get protective orders, and assist you in applying for state financial help to cover counseling and medical bills</p>

  <h1>About Resilience</h1>
  <p data-role="chapter-dek">Resilience is______________________________. We’re here to___________.</p>
  <h2>What is Advocacy?</h2>
  <p>After being sexually assaulted, you may want someone to help you with whatever happens next. You may decide that you want to go to the hospital for medical care, make a police report, and/or explore your other rights and options for healing.</p>
  <p>An advocate can help and accompany you during each step of this process by providing you, your family, and your friends with information and assistance. This help is called advocacy. Resilience is one of many rape crisis centers in Illinois with advocates who are available to help you and your loved ones. Resilience advocates provide free and confidential survivor-centered services and have experience providing support and comfort to people navigating medical and legal systems.</p>
  <h2>Confidentiality</h2>
  <p>As a teen, you have absolute confidentiality with your Resilience advocate - that means we won’t share details of what we discuss with you with anyone else - including your parents or school. The only exception to this is if you become an immediate risk of harm to yourself or someone else.</p>
  <h2>How Do I Contact a Resilience Advocate?</h2>
  <p>If you are in the emergency room (ER) at a Resilience partner hospital, the nurse will contact an advocate to come speak to you in-person. The advocate will be able to arrange ongoing follow-up services with Resilience, if you are interested.</p>
  <p>To request follow-up services or connect with an advocate at a later date, reach out to Resilience directly during regular business hours Mon through Fri, 9am to 5pm</p>
  <div data-block-type="contact-row"><span>ourresilience.org</span><span>312-443-9603</span><span>info@ourresilience.org</span></div>
  <h2 data-policy="split">What Does an Advocate <u>Do</u>?</h2>
  <p>An advocate helps the survivor understand what legal and medical options are available to them and speaks up for the survivor’s rights and wishes.</p>
  <p>With the survivor’s permission, the advocate can talk with people like...</p>
  <ul><li>hospital staff,</li><li>law enforcement,</li><li>and attorneys</li></ul>
  <p>on their behalf to obtain information and make sure that the survivor’s rights and wishes are being respected.</p>
  <h2>What Does an Advocate <u>Not Do</u>?</h2>
  <p>An advocate supports survivors in many ways, but there are also certain things that advocates cannot do.</p>
  <ul><li>Advocates are not lawyers and cannot give legal advice or representation.</li><li>Advocates do not investigate the case, nor do they provide testimony.</li><li>An advocate does not provide therapeutic services.</li></ul>
  <p>Resilience legal advocates provide information, accompaniment, and emotional support to survivors in accessing their legal rights and options, which are listed below. Advocates may act as liaisons with police officers, sex crimes detectives, and the State’s Attorney’s Office to ensure that proper charges are pursued and filed. They may also support survivors in obtaining protective orders, applying for Crime Victim Compensation, and accessing school- or employment-based accommodations and survivor-based immigration options.</p>
  <p>Resilience advocates have referral options for free or low-cost legal counsel.</p>
  <p>To request help accessing your legal rights and options, please reach out to Resilience directly during regular business hours Mon through Fri, 9am to 5pm</p>
  <div data-block-type="contact-row"><span>ourresilience.org</span><span>312-443-9603</span><span>info@ourresilience.org</span></div>

  <h1>Navigating Emotions</h1>
  <p data-role="chapter-dek">__________________________________________.</p>
  <h2>Right now, you might be feeling</h2>
  <figure data-block-type="emotion-exercise">
    <ul><li>Angry</li><li>Sad</li><li>Frozen</li><li>Confused</li><li>Anxious</li><li>Scared</li><li>Happy</li><li>Energetic</li><li>Tired</li><li>Relieved</li><li>Overwhelmed</li><li>Numb</li><li>Vengeful</li><li></li><li></li><li></li></ul>
    <p data-role="reassurance">It’s all valid.</p>
  </figure>
  <h2>Others have felt that way too...</h2>
  <figure data-block-type="visual-grid" data-count="6"></figure>
  <h2>Here are some things that have helped them...</h2>
  <figure data-block-type="visual-grid" data-count="6"></figure>
  <h2>Trauma Therapy Services</h2>
  <p>Resilience has trained, professional clinical staff that provide free individual, couples, and family trauma therapy for adolescent and adult victims/survivors of sexual violence over the age of 12 as well as their loved ones. Please note that there may be a waitlist for trauma therapy services. Support groups are also available. For individuals ages 11 years or younger, Resilience can make a referral to the YWCA’s trauma therapy program.</p>
  <p>To request trauma therapy services, please reach out to Resilience directly during regular business hours Mon through Fri, 9am to 5pm</p>
  <div data-block-type="contact-row"><span>ourresilience.org</span><span>312-443-9603</span><span>info@ourresilience.org</span></div>

  <h1>Hospital Visit</h1>
  <p data-role="chapter-dek">You’re at the hospital for________________________________.</p>
  <h2>Your rights at the hospital</h2>
  <p>Illinois law (SASETA, 410 ILCS 70) requires that hospitals either provide treatment for or transfer sexual assault patients. For those who elect to provide treatment to sexual assault survivors, they are required to offer the following services for the first seven days post-assault (72 hours for survivors age 12 and younger).</p>
  <h2 data-policy="split">The hospital is required to offer you:</h2>
  <blockquote><strong>Private Examination Room and Timely Response</strong><br>Hospitals are required to initiate a medical forensic examination for a sexual assault survivor within 90 minutes of the patients’ arrival, assuming the patient consents to services.</blockquote>
  <blockquote><strong>Access to a Qualified Medical Provider (QMP)</strong><br>Hospitals must provide a <strong>qualified medical provider</strong> (<strong>QMP</strong>) to complete your medical forensic examination. A QMP is a board-certified child abuse pediatrician, board-eligible child abuse pediatrician, a sexual assault forensic examiner, or a sexual assault nurse examiner who has access to photo documentation tools, and who participates in peer review. If a patient is not offered services by a QMP, they have the right to file a complaint with the Illinois Department of Public Health. A Resilience advocate can assist with this process, if requested.</blockquote>
  <div data-block-type="callout-group">
    <blockquote><strong>Evidence Collection</strong><br>Known as a rape kit or <strong>Illinois State Police Sexual Assault Evidence Collection Kit</strong> (ISPECK). Evidence collection is optional and may assist in a criminal or child protection investigation. There are two steps to consenting to evidence collection:</blockquote>
    <div data-block-type="steps"><ol><li>Consent to the collection of evidence</li><li>Consent to either holding the kit in storage or releasing the evidence to law enforcement for testing.</li></ol></div>
    <p>A patient may choose to have an ISPECK collected and may decide later whether or not they want it tested.</p>
  </div>
  <blockquote><strong>Referral for Confidential Counseling and Emotional Support Services</strong><br>Resilience provides 24-hour crisis services in the emergency rooms at its partner hospitals as well as follow-up advocacy and trauma therapy services. Resilience may provide referrals to the YWCA RISE therapy program for minors who are 11 years old or younger.</blockquote>
  <blockquote><strong>Medications for Treatment at the Hospital and After Discharge</strong><br>This includes but is not limited to: emergency contraception, HIV, and sexually transmitted infection (STI) prophylaxis as considered appropriate by the attending physician. Patients will receive verbal and written information about all medications provided and their associated risks and benefits.</blockquote>
  <blockquote><strong>Oral and written information about follow-up exams, laboratory testing needs, and options to determine the presence or absence of pregnancy, STIs, and HIV</strong><br>It is recommended that you receive follow-up STI testing two weeks, six weeks, three months, and six months after a sexual assault.</blockquote>
  <div data-block-type="callout-group">
    <blockquote><strong>Free follow-up care related to the sexual assault</strong><br>All patients can receive 180 days of free follow-up care related to the sexual assault.</blockquote>
    <div data-block-type="card-grid"><article>Private insurance, Medicare, or uninsured patients will receive a <strong>Authorization for Payment Voucher</strong></article><article>Medicaid patients are <strong>automatically eligible</strong> for free follow-up care and don’t need a voucher.</article></div>
    <p>Follow-up care includes but is not limited to lab testing, medications, and counseling related to the sexual assault. Hospitals must issue a voucher to patients treated for sexual assault upon discharge and should place a copy of the voucher in the patient’s medical record.</p>
  </div>
  <h2 data-page-break-before="true">Costs</h2>
  <p>You won’t be directly billed for your outpatient care.</p>
  <blockquote><strong>Direct Billing of Survivor Prohibited by Law</strong><p>As a survivor of sexual assault, the law provides that you should not be directly billed by any ambulance provider providing transportation services, or by any hospital, health care professional, laboratory, or pharmacy for hospital emergency services or evidence collection in the emergency department. <u>If you have insurance, your insurance will be billed, but you are not responsible for any deductible or co-pay related to these services.</u></p><p>If you are not the primary policy holder (e.g you’re on your parents insurance), you may opt of out of your insurance being billed and a bill should be sent to the Illinois Department of Healthcare and Family Services (DHFS) Sexual Assault Emergency Treatment Program. A Resilience advocate can assist with this process, if requested.</p></blockquote>
  <div data-block-type="callout-group">
    <blockquote><strong>Voucher for free follow-up care related to the sexual assault</strong><p>All patients can receive <strong>180 days of free follow-up care related to the sexual assault.</strong></p></blockquote>
    <div data-block-type="card-grid" data-layout="stack"><article><strong>Private insurance, Medicare, or uninsured patients:</strong><p>Before leaving the emergency department of the facility that treated you, the hospital will give you an <u>Authorization for Payment Voucher</u> for follow-up healthcare.</p><p>Present the voucher to the health care provider and ask them to make you a copy, so you have one for your next follow-up appointment. You may also ask the hospital for a copy from your medical record. A Resilience advocate can help.</p></article><article><strong>Medicaid patients</strong><p>If you are covered by Medicaid, Medicaid will pay for your follow-up treatment. Present your Medicaid card to the follow-up provider. All services covered by the voucher are also covered by Medicaid.</p></article></div>
  </div>
  <blockquote><strong>“Follow-up Healthcare”</strong><p>means healthcare services related to a sexual assault, including laboratory and pharmacy services, provided within 180 days of your initial visit for hospital emergency services.</p><p>It is recommended that you or your advocate contact the provider to ensure they accept and are familiar with the voucher as a form of payment prior to service.</p></blockquote>
  <div data-block-type="callout-group">
    <blockquote><strong>Number to Call If You Receive a Related Hospital Bill.</strong><p>You may call the hospital directly if you receive a bill for hospital emergency services or evidence collection services related to the sexual assault. If you should not have received a bill, the hospital will make the necessary adjustments. You may also contact Resilience for assistance with contacting the hospital on your behalf.</p></blockquote>
    <div data-block-type="contact-row"><span>ourresilience.org</span><span>312-443-9603</span><span>info@ourresilience.org</span></div>
  </div>
  <div data-block-type="callout-group">
    <blockquote><strong>Inpatient Care</strong><p>Inpatient care means _____________________________________________.</p><p>If you are admitted to the hospital as an inpatient, you may be billed for inpatient services provided by a hospital, health care professional, laboratory, or pharmacy. If you have insurance coverage, your insurance company will be billed and you may be responsible for any co-pay, deductible, or co-insurance assessed by your insurance company.</p><p>If you have no insurance, you may be eligible for a discount under the Hospital Uninsured Patient Discount Act. To find out if you are eligible for financial help under the Crime Victims Compensation Act, contact the Office of the Illinois Attorney General, Crime Victim Services Division at 1-800-228-3368 (Voice), 1-877-398-1130 (TTY).</p><p>You may also contact Resilience at 312-443-9603 to work with an advocate in filing for Crime Victims Compensation.</p></blockquote>
    <div data-block-type="contact-row"><span>ourresilience.org</span><span>312-443-9603</span><span>info@ourresilience.org</span></div>
  </div>
  <h2>Evidence Collection</h2>
  <p>Evidence is collected using an Illinois State Police Sexual Assault Evidence Collection Kit (ISPECK). Evidence collection is optional and may assist in a criminal or child protection investigation.</p>
  <p>Hospitals are required to offer an ISPECK to anyone at any age within 7 days of the last sexual contact, in accordance with the guidelines of the Sexual Assault Survivors Emergency Treatment Act (SASETA).</p>
  <p>We like to think of the ISPECK as a way to ‘freeze’ a moment in time. It documents things like bruises, injuries, and physical evidence of sexual activity - like DNA (from saliva, semen, hair). It can include photos, an internal exam, a toxicology screening for the use of drugs or alcohol, testing of clothes or wigs worn during the assault, and more.</p>
  <p>All steps are optional. It’s important to note that the ISPECK cannot prove if an assault happened (you know best!) - it can only document what physical evidence is on the body.</p>
  <hr data-block-type="section-divider">
  <p>There are two steps to consenting to evidence collection:</p>
  <div data-block-type="steps"><ol><li>Consent to the collection of evidence</li><li>Consent to either holding the kit in storage or releasing the evidence to law enforcement for testing.</li></ol></div>
  <p>A patient may choose to have an ISPECK collected and may decide later whether or not they want it tested. Law enforcement must hold the ISPECK for 10 years or until the patient’s 28th birthday, whichever happens latest, while the patient decides whether or not to have the evidence tested.</p>
  <h2 data-page-break-before="true" data-start-continued="true">Evidence Collection</h2>
  <p>Anyone at any age can consent to treatment and evidence collection related to a sexual assault. A minor under 13 years of age needs a parent, legal guardian, or healthcare power of attorney to release the kit for testing and with the assent of the sexual assault survivor.</p>
  <p>No person, regardless of age, should be forced to complete the evidence collection process.</p>
  <p>People with disabilities do not need a guardian present to consent to medical treatment, evidence collection, or release of evidence for testing.</p>
  <p>If a survivor is unable to consent to the release of evidence for testing and their parent, legal guardian, and/or healthcare power of attorney refuse to do so, the State's Attorney or Attorney General can petition the court to authorize release for testing. No person with a disability should ever be forced to complete evidence collection.</p>

  <h1>Legal Process</h1>
  <p data-role="chapter-dek">Sexual assault and abuse are violent crimes, it’s the responsibility of the state to prosecute.</p>
  <h2>First Step</h2>
  <p>Making a police report is the first step in prosecuting the person who harmed you. Anyone at any age can make a police report, and you have many options when it comes to how and where to report a sexual assault.</p>
  <ul><li>You can report a sexual assault in person at the hospital, at a police station, or over the phone.</li><li>You can choose to make the report yourself or ask a healthcare provider or loved one to do so on your behalf.<ul><li>Remember that reporting does not mean that you are committing to participating in a criminal investigation, but without your participation, it is more difficult for a State’s Attorney to prosecute the case.</li></ul></li><li>Seeking police assistance and court action may involve you in a long and complex process, but a Resilience advocate can support you through that process and answer any questions you might have.</li></ul>
  <h2>Civilian Office of Police Accountability (COPA)</h2>
  <p>Survivors who have experienced sexual or domestic violence committed by a City of Chicago police officer can report the incident to Civilian Office of Police Accountability (COPA) by phone, mail, or in person. COPA investigates certain crimes committed by Chicago police officers, whether on or off duty.</p>
  <p>For more information, visit their website at</p>
  <div data-block-type="resource-link">www.chicagocopa.org/complaints</div>
  <p>A Resilience advocate can support you through the process.</p>

  <h2 data-page-break-before="true">Orders of Protection</h2>
  <blockquote><strong>Orders of Protection under the Illinois Domestic Violence Act</strong><p>A judge can grant up to 18 protections, including...</p><ul><li>prohibiting further abuse,</li><li>ordering the offender to stay away,</li><li>taking away a Firearm Owners Identification (FOID) card,</li><li>protecting property and pets,</li><li>requiring financial support,</li><li>providing temporary care of children, and</li><li>ordering exclusive possession of the home.</li></ul><p>Violations of a Domestic Violence Order of Protection may result in criminal charges.</p></blockquote>
  <blockquote><strong>Who is eligible for protection?</strong><p>Family or household members who:</p><ul><li>Are related by blood or by current or former marriage to the offender;</li><li>Share or shared a home with the offender;</li><li>Have or allegedly have a child in common with the offender;</li><li>Have or had a dating relationship or engagement with the offender; or</li><li>Are high risk adults with disabilities abused by a family member or caregiver.</li></ul></blockquote>
  <blockquote><strong>Illinois Gender Violence Act (GVA)</strong><p>The GVA is a civil rights law that allows survivors of sex-based violence, including domestic violence and sexual assault, to sue the person who harmed them in civil court. The GVA went into effect on January 1, 2004, and may be used by any person who has experienced sex-based violence since inception. The GVA may be used by any survivor regardless of whether or not they ever filed a police report or if their abuser was ever criminally charged or prosecuted. The statute of limitations under GVA is seven years.</p></blockquote>

  <h2 data-page-break-before="true" data-start-continued="true">Orders of Protection</h2>
  <blockquote><strong>Stalking No Contact Order</strong><p>The judge can grant any or all of the following protections:</p><ul><li>Prohibit further stalking or threats of stalking;</li><li>Prohibit contact with the victim;</li><li>Order the stalker to stay away from specific locations;</li><li>Prohibit the stalker from having a FOID card and owning firearms;</li><li>Attorneys’ fees; and</li><li>Other protections as deemed necessary.</li></ul><p>Violations of a Domestic Violence Order of Protection may result in criminal charges.</p></blockquote>
  <blockquote><strong>Who is eligible for protection?</strong><p>Any person who is the victim of behaviors that cause them to fear for their safety, for the safety of another person, or to suffer emotional distress on at least two separate occasions. This excludes instances of domestic and/or sexual violence, since protections are already available via the Illinois Domestic Violence Act or through a Sexual Assault Civil No Contact Order. Violations of a Stalking No Contact Order may result in criminal charges.</p></blockquote>
  <blockquote><strong>Sexual Assault Civil No Contact Order</strong><p>A judge can grant any or all of the following protections:</p><ul><li>Prohibit contact with the victim by any means, including contact through third parties;</li><li>Order the offender to stay away from the victim generally and/or to stay away from specific locations like school or work; and</li><li>Other protections as deemed necessary.</li></ul></blockquote>
  <blockquote><strong>Who is eligible for protection?</strong><p>Any person who is a victim of nonconsensual sexual conduct or penetration.<br>These orders can also protect family or household members of a victim and rape crisis center employees or volunteers. Violations of a Sexual Assault Civil No Contact Order may result in criminal charges.</p></blockquote>

  <h2 data-page-break-before="true">Survivor-Based Immigration Options</h2>
  <blockquote><strong>Violence Against Women Act (VAWA)</strong><p>Provides protections for victims of domestic and sexual violence. If you are married to your domestic violence abuser and they are a citizen or a legal resident, you may be able to take their place in petitioning or continuing a petition for legal residency.</p></blockquote>
  <blockquote><strong>U-Visa</strong><p>If you are a victim of domestic or sexual violence, you may be eligible for a U-Visa, which if granted, would allow you to remain in the United States for 4 years and make you eligible for work authorization. After 3 years, you may apply for legal residency. To be eligible for a U-Visa, you must report the offense and cooperate with the investigation and prosecution of the criminal case to the extent that you are asked to do so.</p></blockquote>
  <blockquote><strong>T-Visa</strong><p>If you are a victim of human trafficking, you may be eligible for a T-Visa, which would allow you to remain in the United Sates for up to 4 years and make you eligible for work authorization and certain state and federal benefits and services. After 3 years, you may apply for legal residency. To be eligible for a T-Visa, you may be required to cooperate with an investigation and prosecution of a criminal case.</p></blockquote>

  <h1>At School and Work</h1>
  <h2>School Accommodations</h2>
  <p>State and federal law prohibit sex discrimination in educational settings. A school’s failure to respond to reports of sexual violence or to accommodate student survivors may qualify as sex discrimination under these laws. If the person who caused harm is a student or faculty of the school, then the school also has a responsibility to investigate the harm you experienced.</p>
  <p>If you choose to file a Title IX complaint and engage in the Title IX process, you may be able to pursue disciplinary action against the person who harmed you and access accommodations such as:</p>
  <ul><li>Changing class schedules;</li><li>Providing an escort between classes and/or work;</li><li>Transportation accommodations;</li><li>Obtaining or enforcing campus/state orders of protection/no-contact orders;</li><li>Excused absences;</li><li>Extensions on assignments/exams;</li></ul>
  <h2>Employment Accommodations</h2>
  <p>The <strong>Victims’ Economic Security and Safety Act (VESSA)</strong> allows victims of domestic, sexual, or gender-based violence, or who have family or household members who have experienced such violence, to take unpaid leave from work without penalty, discrimination, or retaliation to:</p>
  <ul><li>Seek medical attention or recover from physical or psychological injuries caused by domestic or sexual violence;</li><li>Obtain services from a victim services program;</li><li>Obtain counseling services;</li><li>Participate in safety planning, relocate (temporarily or permanently), or take other steps to ensure their safety; and</li><li>Seek legal assistance or go to court.</li></ul>

  <h2 data-page-break-before="true" data-start-continued="true">Employment Accommodations</h2>
  <blockquote><strong>Leave</strong><p>Leave may be taken as needed during a 12-month period.<br>Employers with...</p><ul><li>1-14 employees must allow up to 4 weeks of unpaid leave.</li><li>15 or more employees must allow up to 8 weeks of unpaid leave.</li><li>50 or more employees must allow up to 12 weeks of unpaid leave.</li></ul></blockquote>
  <blockquote><strong>Documentation</strong><p>An employer may require certification that the employee is a victim of domestic or sexual violence or that a family member is a victim. Documentation can include a letter from a victim service agency like Resilience, an attorney, a member of the clergy, medical or other professional providing services to the victim, or a police or court record.</p><p>A Resilience advocate can support you through the process.</p></blockquote>
  <blockquote><strong>Confidentiality</strong><p>Employers must maintain the confidentiality of the employee requesting to take time off under VESSA. Employers must also make reasonable accommodations in a timely manner unless doing so would cause undue hardship.</p><p>Reasonable accommodations may include a transfer or reassignment, a modified work schedule, a change in telephone number or seating assignment, lock installation, or implementation of a safety procedure.</p></blockquote>
  <blockquote><p>Please note that VESSA is not the same as the <b>Family Medical Leave Act</b> (FMLA), which also provides unpaid medical leave for various other personal or family medical reasons. If you do not qualify for VESSA, you may still utilize unpaid time off from work in order to appear in a criminal case. By law, no employer can terminate or punish an employee who has been subpoenaed as a witness to a crime. If you have not already received a subpoena and your presence is required in court, the State’s Attorney’s Office can provide one for you.</p><p>A Resilience advocate can support you through the process.</p></blockquote>

  <h1>Minors Rights, Consent, and Sexual Assault</h1>
  <p data-role="chapter-dek">Illinois Coalition Against Sexual Assault - Aug 2022</p>
  <h2 data-repeat="header">How old does an individual have to be to...</h2>
  <table><tbody><tr><th colspan="3">Consent to sexual activity?</th></tr><tr><td colspan="3"><strong>Age 17</strong><br><br><strong>Age 18, IF:</strong><ul><li>The other party is in a position of trust, authority, or supervision</li><li>The other party is a family member</li></ul></td></tr><tr><td>720 ILCS 5/11-1.50(b) &amp; (c)<br>720 ILCS 5/11-1.60(c) &amp; (d)</td><td>720 ILCS 5/11-1.20(a)(4)<br>720 ILCS 5/11-1.60(f)</td><td>720 ILCS 5/11-1.20(a)(3)<br>720 ILCS 5/11-1.60(b)</td></tr></tbody></table>
  <table><tbody><tr><th>Consent to counseling at a rape crisis center?</th></tr><tr><td><strong>Age 12-&nbsp;&nbsp;16</strong><br>8 initial sessions, up to 90 minutes each, then 4-factor well-being test</td></tr><tr><td>405 ILCS 5/3–550 (citation renumbered effective 8/21/2021)</td></tr></tbody></table>
  <table><tbody><tr><th>Decide whether a parent or guardian can be part of a minor’s rape crisis center counseling sessions or see minor’s file?</th></tr><tr><td><strong>Age 12</strong></td></tr><tr><td>735 ILCS 5/8-802.1(c)(2)</td></tr></tbody></table>
  <table><tbody><tr><th>Waive/choose not to waive privilege at a rape crisis center?</th></tr><tr><td><strong>Age 12</strong></td></tr><tr><td>735 ILCS 5/8-802.1(c)(4)</td></tr></tbody></table>
  <table><tbody><tr><th>Consent to advocacy at a rape crisis center?</th></tr><tr><td><strong>Age 12 - 16</strong></td></tr><tr><td>Limited services consistent with 405 ILCS 5/3-550</td></tr></tbody></table>
  <table><tbody><tr><th>Make a report to police without a parent or guardian?</th></tr><tr><td><strong>Any Age</strong> - Law enforcement may not force anyone to make a report, but you could be subpoenaed to provide information.<br><br><strong>Age 12</strong> to get help from a rape crisis center</td></tr><tr><td>725 ILCS 203/20: SAIPA has no age restriction and requires “a law enforcement officer shall complete a written police report” when a person reports they were sexually assaulted or abused.<br><br>*As of 8/11/17, victims under age of 18 have no statute of limitations for sexual assault, aggravated sexual assault, predatory sexual assault of a child, aggravated sexual abuse, or felony sexual abuse. 720 ILCS 5/3-6(j)(1)</td></tr></tbody></table>
  <table><tbody><tr><th>Consent to healthcare at the hospital?</th></tr><tr><td><strong>Any Age</strong> - if a victim of sexual assault or abuse or who needs emergency treatment</td></tr><tr><td>410 ILCS 210/3(b), 410 ILCS 70/5-1(b), 410 ILCS 210/3(a)</td></tr></tbody></table>
  <table><tbody><tr><th>Consent to evidence collection at the hospital?</th></tr><tr><td><strong>Any Age</strong></td></tr><tr><td>410 ILCS 70/5-1(b)</td></tr></tbody></table>
  <table><tbody><tr><th>Consent to release an evidence collection kit for testing?</th></tr><tr><td><strong>Age 13</strong><br>A kit completed on a minor must be held by law enforcement for 10 years from the date the minor turns 18; they have until their 28th birthday to consent to release the kit for testing.</td></tr><tr><td>410 ILCS 70/6.5-1(a)(1), 410 ILCS 70/6.5-1(c)</td></tr></tbody></table>
  <table><tbody><tr><th colspan="3">File a petition for a...<ul><li>Civil No Contact Order (CNCO),</li><li>Domestic Violence Order of Protection (OP), or</li><li>Stalking No Contact Order (SNCO)?</li></ul></th></tr><tr><td colspan="3"><strong>Any Age*</strong><br>*In some counties, including Cook County, a minor must be accompanied by an adult who will petition on behalf of the minor.</td></tr><tr><td><strong>CNCO:</strong><br>740 ILCS 22/201(b)(1) &amp; (2)<br>740 ILCS 22/213(a)</td><td><strong>OP:</strong><br>750 ILCS 60/201(b)(i)<br>750 ILCS 60/214(a)</td><td><strong>SNCO:</strong><br>740 ILCS 21/15(1) &amp; (2)<br>740 ILCS 21/80(a)</td></tr></tbody></table>
  <table><tbody><tr><th>Obtain birth control</th></tr><tr><td><strong>Any Age*</strong><br>*IF: (1) married, (2) a parent, (3) pregnant, (4) have parent/guardian consent, (5) failure to provide would create serious health hazard or (6) referred by physician, clergy, or planned parenthood agency</td></tr><tr><td>325 ILCS 10/1</td></tr></tbody></table>
`;
