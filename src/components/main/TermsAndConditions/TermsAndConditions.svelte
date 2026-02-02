<script>
	import { goto } from '$app/navigation';
	import { X } from 'lucide-svelte';
</script>

<div
	class="p-5 md:p-12 mx-auto font-mulish w-[370px] md:w-[756px] lg:w-[856px] min-h-full rounded-[20px] bg-linear-to-b from-[#5449AC] from-0.5% to-[#FFFFFF00] to-5% relative"
>
	<div class="flex justify-center gap-3 mb-7">
		<h2
			class="text-lg md:text-[24px] justify-center text-white"
			style="font-family: 'Impact', sans-serif;"
		>
			Terms and Conditions
		</h2>
		<button
			onclick={() => {
				goto('/');
			}}
			class="absolute top-7 right-5 cursor-pointer bg-white h-[35px] w-[35px] flex items-center justify-center text-[18px] rounded-full text-[#60269e]"
		>
			<X />
		</button>
	</div>
	<div class="flex flex-col text-[14px] md:text-[18px] gap-5 md:gap-8 text-black">
		<div class="space-y-2">
			<p class="font-medium text-white">Last updated: 28 January 2026</p>
			<p class="font-medium text-white/90">Effective as of: 1 Febuary 2026</p>
		</div>

		<section>
			<h3 class="font-semibold mb-2">1) About Rafiki X</h3>
			<p>
				Rafiki X is a digital career‑development platform that helps users explore career options,
				ask questions, plan career paths, improve CVs and LinkedIn profiles, practise interviews,
				and create compelling application stories. These services are delivered through a
				combination of human guidance and algorithmic processing techniques, which may process
				personal data as described in our Privacy Notice.
			</p>
			<p>
				The Platform is operated by Kayode Alabi Leadership and Career Initiative – KLCI; CAC
				registration number: CAC/IT/NO 120904, with its registered place of business at No. 6, Akin
				Ojowa Street, Olambe, Ogun State. This entity acts as the data controller for the processing
				of personal data in connection with the Platform.
			</p>
			<p>
				For support or legal notices, contact support@rafikigen.ai. For questions about how your
				personal data is processed or to exercise your data protection rights, please refer to our
				Privacy Notice or contact us via the privacy contact details provided in this Terms and
				Conditions.
			</p>
		</section>

		<section>
			<h3 class="font-semibold text-black mb-2">2) Acceptance of Terms</h3>
			<p>
				By accessing or using Rafiki X (including any website, web app, API, or related services),
				you agree to be bound by these Terms and Conditions. The processing of your personal data is
				governed by our Privacy Notice and Cookie Notice, which are incorporated by reference.
				Acceptance of these Terms does not constitute consent for any processing activity that,
				under applicable data protection laws, requires your separate or explicit consent (such as
				certain types of cookies, marketing communications, or automated processing techniques).
				Where required, we will request such consent through a distinct and clear mechanism.
			</p>
			<p>
				If you do not accept these Terms, you must not use the Platform. Your statutory data
				protection rights remain unaffected by this acceptance.
			</p>
		</section>

		<section>
			<h3 class="font-semibold text-black mb-2">3) Eligibility</h3>
			<p>
				To use Rafiki X, you must meet the minimum age of digital consent applicable in your country
				of residence. Where local law sets no clear standard, a minimum age of 16 applies. By
				accessing the Platform, you confirm that you have the legal capacity to enter into a binding
				agreement, or that you have obtained verifiable parental or guardian consent where required
				by law.
			</p>
			<p>
				Rafiki X may use reasonable age‑verification measures or request additional information to
				confirm eligibility. We do not knowingly collect personal data from individuals below their
				applicable age of consent without the legally required authorization.
			</p>
			<p>
				If we become aware that an underage individual is using the Platform without the necessary
				consent, we will take appropriate steps, including requesting verification and, where
				confirmed, suspending the account and deleting personal data in accordance with our Privacy
				Notice and applicable laws such as the Nigeria Data Protection Act and the GDPR. Parents or
				guardians may contact us at privacy@rafikigen.ai to review, correct, or delete a child's
				information or withdraw consent.
			</p>
			<p>
				In addition, our Privacy Notice explains how we obtain, verify, and record parental/guardian
				consent and how such consent can be withdrawn.
			</p>
		</section>

		<section>
			<h3 class="font-semibold text-black mb-2">4) Accounts and Security</h3>
			<p>
				You may need to create an account using accurate and current information. You are
				responsible for taking reasonable steps to secure your login credentials and for activity
				that occurs under your account when such credentials are used by you or someone you have
				allowed to access them.
			</p>
			<p>
				You must keep your credentials confidential. If you suspect unauthorised access or believe
				your credentials have been compromised, you must promptly notify support@rafikigen.ai.
			</p>
			<p>
				Rafiki X implements appropriate technical and organisational measures to protect accounts
				and personal data, but we are not responsible for losses arising from your failure to follow
				reasonable security practices. Nothing in this clause limits Rafiki X's obligations under
				applicable data protection or cybersecurity laws, including obligations relating to breach
				notification.
			</p>
			<p>
				We may refuse, suspend, or terminate accounts where necessary to comply with law, enforce
				these Terms, or address security concerns, as described in our Privacy Notice.
			</p>
		</section>

		<section>
			<h3 class="font-semibold text-black mb-2">5) Services and AI‑Assisted Features</h3>
			<p>
				Rafiki X may provide guidance, suggestions, or content generated or supported by automated
				or algorithmic processing techniques. These outputs are provided for informational and
				educational purposes only. You should review all AI‑assisted outputs carefully and exercise
				independent judgment before relying on them, for example, when preparing CVs, job
				applications, or interview responses.
			</p>
			<p>
				We use appropriate technical and organisational measures to protect your personal data.
				Personal data submitted to AI‑assisted features is processed within secure systems and is
				not used by third‑party AI providers to train publicly available models. Where our automated
				systems produce outcomes that may significantly affect you, you have the right to request
				human review, express your point of view, and contest the outcome, as described in our
				Privacy Notice.
			</p>
			<p>
				We regularly monitor and evaluate our automated systems to improve accuracy, fairness, and
				reliability.
			</p>
		</section>

		<section>
			<h3 class="font-semibold text-black mb-2">6) Subscriptions, Donations and Payments</h3>
			<p>
				Rafiki X offers free and premium plans. Premium features, such as enhanced generation tools,
				require a paid subscription billed in Nigerian Naira (NGN) on a recurring basis unless
				cancelled. You may cancel your subscription at any time through your account dashboard, and
				you will retain access to premium features until the end of the current billing period.
			</p>
			<p>
				Payments are processed securely through third‑party payment processors who comply with
				applicable financial‑security standards. Rafiki X does not store your full payment card
				details. We process your payment information only as necessary to manage subscriptions,
				prevent fraud, and comply with legal obligations, as explained in our Privacy Notice.
			</p>
		</section>

		<section>
			<h3 class="font-semibold text-black mb-2">7) Refund Policy</h3>
			<p>
				Refund requests are evaluated fairly and may be approved for issues such as duplicate
				charges or technical faults. Approved refunds are issued to your original payment method
				through our external payment processor. Although refunds typically arrive within 3 to 10
				working days, processing times may vary depending on your bank or financial institution.
				Where required to process refunds, limited transaction data may be shared with payment
				processors or relevant institutions, in accordance with our Privacy Notice. Transaction fees
				charged by payment processors are non‑refundable.
			</p>
		</section>

		<section>
			<h3 class="font-semibold text-black mb-2">8) Consumer Rights</h3>
			<p>
				We comply with applicable consumer‑protection laws in all regions where we operate and do
				not apply "no‑refund" policies that violate mandatory legal rights. If any part of these
				Terms conflicts with the consumer laws or data‑protection laws in your country, those laws
				take priority.
			</p>
			<p>
				Your statutory privacy rights, including rights relating to access, deletion, correction,
				objection, and withdrawal of consent, remain unaffected by this section.
			</p>
		</section>

		<section>
			<h3 class="font-semibold text-black mb-2">9) Acceptable Use</h3>
			<p>To keep Rafiki X safe and fair, you agree not to:</p>
			<ul class="list-disc list-inside space-y-2 ml-2">
				<li>
					<strong>Behave Badly:</strong> Do not use the Platform for anything illegal, harmful, harassing,
					or discriminatory.
				</li>
				<li>
					<strong>Misuse AI:</strong> Do not attempt to bypass our safety filters, perform "prompt injection"
					(jailbreaking), or use the Platform to generate misinformation.
				</li>
				<li>
					<strong>Upload prohibited content:</strong> Do not upload content that violates someone else's
					privacy, copyrights, or legal rights.
				</li>
				<li>
					<strong>Scrape or harvest:</strong> Do not scrape, harvest, or use automated tools to extract
					data from our Platform. You also agree not to use our AI outputs to train or develop your own
					competing AI models.
				</li>
				<li>
					<strong>Test security without permission:</strong> Do not test our security (e.g., penetration
					testing), probe for vulnerabilities, or interfere with how the Platform runs without our written
					permission.
				</li>
				<li>
					<strong>Impersonate or defraud:</strong> Do not impersonate others, lie about who you are, or
					use the Platform for fraudulent schemes.
				</li>
			</ul>
			<p>
				We reserve the right to suspend or close your account immediately if we reasonably believe
				you have violated these rules. Under Nigeria's Data Protection Act and other global privacy
				laws, you also have the right to challenge any automated decision that significantly affects
				you by contacting us at support@rafikigen.ai.
			</p>
		</section>

		<section>
			<h3 class="font-semibold text-black mb-2">10) Intellectual Property</h3>
			<p>
				Rafiki X and its original software, designs, logos, and features are protected by copyright
				and trademark laws; therefore, you may not copy, modify, reverse-engineer, or commercially
				exploit any part of our Platform without our permission. You retain full ownership of the
				content you provide, such as your prompts and personal details, as well as the specific
				outputs generated for you, like your CVs or application stories. By using the Platform, you
				grant Rafiki X a non-exclusive, worldwide, and royalty-free license to host and process your
				content solely to provide and improve our services, ensure security, and prevent abuse on
				the lawful bases and for the purposes described in our Privacy Notice.
			</p>
		</section>

		<section>
			<h3 class="font-semibold text-black mb-2">11) Third‑Party Services and Links</h3>
			<p>
				Rafiki X may integrate with or connect you to third‑party services, such as payment
				processors or sign‑in providers, that are not owned or controlled by us. Depending on the
				integration, Rafiki X may act as a data controller, while such third parties may act as
				independent controllers or processors of your personal data in accordance with their own
				terms and privacy policies. We require them by contract to implement appropriate technical
				and organisational measures and process personal data only on our documented instructions.
			</p>
			<p>
				We encourage you to review those third‑party policies carefully, as we do not control their
				content, security practices, or data handling activities. While we take reasonable steps to
				select reputable providers and implement appropriate contractual and technical safeguards,
				Rafiki X is not responsible for the privacy practices of third‑party services.
			</p>
			<p>
				Your use of these integrations may involve the sharing of certain personal data (such as
				contact details, authentication information, or payment data). International transfers are
				subject to appropriate safeguards (such as adequacy decisions or standard contractual
				clauses/IDTA), as outlined in our Privacy Notice.
			</p>
		</section>

		<section>
			<h3 class="font-semibold text-black mb-2">12) Privacy, Cookies and Data Protection</h3>
			<p>
				Your use of the Platform is governed by our Privacy Notice and Cookie Notice, which describe
				how Rafiki X, as data controller, collects, uses, shares, and safeguards personal data, and
				how cookies and similar technologies are used. These notices address applicable data
				protection requirements, including the Nigeria Data Protection Act (NDPA), the EU/EEA GDPR,
				the UK GDPR, and, where applicable, U.S. children's privacy laws.
			</p>
			<p>
				Acceptance of these Terms does not replace or override any separate consent choices you may
				be required to make, including cookie preferences. Please review the Privacy Notice and
				Cookie Notice carefully before using the Platform, as they form an integral part of these
				Terms and may be updated from time to time.
			</p>
			<p>
				You can manage cookie preferences at any time via our cookie banner or preferences center
				linked in the footer.
			</p>
		</section>

		<section>
			<h3 class="font-semibold text-black mb-2">13) Global Access and Compliance</h3>
			<p>
				Rafiki X may be accessed from various jurisdictions worldwide. While you are responsible for
				ensuring that your use of the Platform complies with applicable local laws, Rafiki X remains
				responsible for complying with its own data protection and privacy obligations under
				applicable law.
			</p>
			<p>
				Where required by law, we implement jurisdiction‑specific measures such as age‑gating,
				consent mechanisms, or localised disclosures, and we may restrict access in certain regions.
				International transfers are subject to appropriate safeguards (such as adequacy decisions or
				standard contractual clauses/IDTA), as outlined in our Privacy Notice.
			</p>
			<p>
				Any restriction or limitation of access does not affect your data protection rights, which
				are explained in our Privacy Notice.
			</p>
		</section>

		<section>
			<h3 class="font-semibold text-black mb-2">14) Disclaimers</h3>
			<p>
				<strong>No guarantees:</strong> Rafiki X provides guidance and tools for informational purposes
				only and does not guarantee employment, internships, scholarships, or other outcomes.
			</p>
			<p>
				<strong>"As is":</strong> The Platform is provided on an "as is" and "as available" basis. To
				the fullest extent permitted by law, Rafiki X disclaims warranties of merchantability, fitness
				for a particular purpose, and non‑infringement. Nothing in these Terms limits or excludes Rafiki
				X's obligations under applicable data protection or privacy laws, including obligations relating
				to the security and lawful processing of personal data.
			</p>
			<p>
				<strong>External opportunities:</strong> Listings or suggestions of third‑party opportunities
				may change or be withdrawn at any time and should be verified independently. This does not affect
				Rafiki X's obligations regarding the accuracy and lawful processing of personal data as described
				in the Privacy Notice.
			</p>
		</section>

		<section>
			<h3 class="font-semibold text-black mb-2">15) Limitation of Liability</h3>
			<p>
				To the maximum extent permitted by law, Rafiki X, its affiliates, directors, officers,
				employees, and agents shall not be liable for any indirect, incidental, consequential,
				special, or punitive damages, or any loss of profits, business, or goodwill, arising from or
				in connection with your use of the Platform.
			</p>
			<p>
				Nothing in these Terms limits or excludes Rafiki X's liability for the unlawful processing,
				loss, or unauthorised disclosure of personal data, or any liability that cannot be excluded
				under applicable data protection or privacy laws.
			</p>
			<p>
				Where permitted by law, your remedy for dissatisfaction with the Platform is to discontinue
				use; this does not affect your statutory rights, including rights to lodge complaints or
				seek remedies under applicable data protection laws.
			</p>
		</section>

		<section>
			<h3 class="font-semibold text-black mb-2">16) Changes to these Terms</h3>
			<p>
				We may update these Terms from time to time. Where a change is material and significantly
				affects your contractual rights or obligations, we will provide advance notice (for example,
				at least 30 days) via email or in‑app notice before the effective date.
			</p>
			<p>
				Continued use of the Platform after the effective date constitutes acceptance of updated
				contractual terms. However, changes relating to the processing of personal data are governed
				by our Privacy Notice and Cookie Notice. Where required by applicable data protection law,
				we will provide additional notice and, where necessary, obtain your explicit consent before
				applying such changes.
			</p>
			<p>
				You may review the most current versions of these Terms and our Privacy Notice at any time.
			</p>
		</section>

		<section>
			<h3 class="font-semibold text-black mb-2">17) Governing Law and Dispute Resolution</h3>
			<p>
				<strong>Law:</strong> These Terms are governed by the laws of the Federal Republic of Nigeria,
				without prejudice to the application of mandatory data protection laws applicable to you based
				on your location.
			</p>
			<p>
				<strong>Good‑faith resolution:</strong> The parties shall first attempt to resolve contractual
				disputes through good‑faith discussions.
			</p>
			<p>
				<strong>Mediation; Arbitration:</strong> Except for matters relating to data protection rights,
				regulatory complaints, or statutory remedies that cannot be subject to arbitration, any dispute
				arising out of or in connection with these Terms shall be referred to mediation, and if unresolved,
				finally settled by binding arbitration seated in Lagos, Nigeria, conducted in English in accordance
				with the Arbitration and Mediation Act 2023 and any applicable institutional rules agreed by the
				parties.
			</p>
			<p>
				Nothing in this clause limits your right to lodge complaints with a competent data
				protection authority or to seek judicial remedies where required under applicable data
				protection laws.
			</p>
		</section>

		<section>
			<h3 class="font-semibold text-black mb-2">18) Suspension and Termination</h3>
			<p>
				We may suspend or terminate your access to the Platform immediately if: (a) you breach these
				Terms or applicable law; (b) there are reasonable security, fraud, or misuse concerns; or
				(c) we are required to do so by law or a lawful order. Where practicable and lawful, we will
				provide notice and information regarding the suspension or termination.
			</p>
			<p>
				You may terminate your account at any time by deleting it through the Platform. Account
				termination does not automatically result in the deletion of all personal data. Personal
				data will be retained, deleted, or anonymized in accordance with our Privacy Notice and
				applicable data protection laws, including where retention is required for legal, security,
				or legitimate business purposes.
			</p>
			<p>
				Any suspension or termination does not affect your data protection rights, which may be
				exercised as described in the Privacy Notice. Provisions relating to intellectual property,
				payments, disclaimers, limitation of liability, dispute resolution, and data protection
				obligations survive termination where applicable.
			</p>
		</section>

		<section>
			<h3 class="font-semibold text-black mb-2">19) Contact</h3>
			<p>
				Full registered legal name ("Rafiki X") is the data controller responsible for the
				processing of personal data under these Terms and our Privacy Notice.
			</p>
			<ul class="list-none space-y-1 ml-0">
				<li><strong>CAC Registration Number:</strong> CAC/IT/NO 120904</li>
				<li><strong>Registered Address:</strong> No. 6, Akin Ojowa Street, Olambe, Ogun State</li>
				<li><strong>Support:</strong> support@rafikigen.ai</li>
				<li><strong>Legal &amp; Compliance:</strong> legal@rafikigen.ai</li>
				<li><strong>Privacy &amp; Data Protection:</strong> privacy@rafikigen.ai</li>
			</ul>
			<p>
				You may contact us using the details above for general inquiries or to exercise your data
				protection rights as described in our Privacy Notice. You also have the right to lodge a
				complaint with a competent data protection authority where required by applicable law.
			</p>
		</section>
	</div>
</div>
