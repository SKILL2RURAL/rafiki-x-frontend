<script>
	import { goto } from '$app/navigation';
	import { X } from 'lucide-svelte';
</script>

<div
	class="p-5 md:p-12 mx-auto font-mulish w-[370px] md:w-[756px] lg:w-[856px] min-h-full rounded-[20px] bg-linear-to-b from-[#5449AC] from-0.5% to-[#FFFFFF00] to-10% relative"
>
	<div class="flex justify-center gap-3 mb-7">
		<h2
			class="text-lg md:text-[24px] justify-center text-white"
			style="font-family: 'Impact', sans-serif;"
		>
			Learn more about rafiki X
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
	<div class="flex flex-col text-[14px] md:text-[18px] gap-5 md:gap-8">
		<p class="text-white font-extrabold">Last updated: April 9th, 2025</p>

		<div class="space-y-6 font-mullish font-medium">
			<div>
				<h3 class="font-bold text-lg mb-3">1. Introduction</h3>
				<p class="mb-3">
					Skill2Rural is a nonprofit organization dedicated to empowering rural communities through
					education and skill-building programs, with a particular focus on children's development.
					We are committed to protecting the privacy of all our users, especially children, and
					operate in compliance with the Nigeria Data Protection Act (2023) and other applicable
					data protection laws.
				</p>
				<p class="mb-3">
					This Privacy Notice explains what personal information we collect, how we use and protect
					this information, your rights regarding your personal data, and special protections for
					children's data.
				</p>
				<p>
					We collect only the information necessary to provide our services and implement robust
					safeguards to protect all personal data in our care. For children under 13, we require
					verifiable parental consent before collecting any personal information.
				</p>
			</div>

			<div>
				<h3 class="font-bold text-lg mb-3">2. Who Does This Statement Apply To?</h3>
				<ul class="list-disc list-inside space-y-2 ml-4">
					<li>
						Children participating in our programs (with special protections for those under 13)
					</li>
					<li>Parents/Legal Guardians of participating children</li>
					<li>
						General Users of our website (www.skill2rural.org), mobile applications, online
						services, and in-person programs
					</li>
					<li>Donors and Partners who interact with our organization</li>
				</ul>
			</div>

			<div>
				<h3 class="font-bold text-lg mb-3">3. What Personal Information Do We Collect?</h3>
				<p class="mb-3">
					We collect only necessary data to provide our services. For children under 16, we obtain
					verifiable parental consent before collection.
				</p>
				<p class="mb-3">
					We collect contact information (name, email, phone, postal address), demographic data
					(age, gender, school/community details), sensitive data (health/disability info if
					relevant), technical data (IP address, cookies, device info), and transaction data
					(donation/payment details).
				</p>
				<p>
					Information sources include: directly from you, automatically through website
					interactions, and from third parties such as professional bodies, government agencies, or
					publicly available sources.
				</p>
			</div>

			<div>
				<h3 class="font-bold text-lg mb-3">4. How Do We Use Your Information?</h3>
				<p class="mb-3">
					We use your personal data for program registration, service delivery, communication
					(program updates, emergency alerts, parental notifications), safety and security
					monitoring, legal compliance, donor transaction processing, program improvement through
					anonymized data analysis, and parental controls.
				</p>
			</div>

			<div>
				<h3 class="font-bold text-lg mb-3">5. Legal Basis for Processing</h3>
				<p class="mb-3">
					We process your personal data based on consent (explicit parental consent for minors),
					legal obligations, legitimate interests (to run programs effectively while ensuring child
					safety), and vital interests (to protect a participant's well-being in emergencies).
				</p>
			</div>

			<div>
				<h3 class="font-bold text-lg mb-3">6. How Do We Share Your Information?</h3>
				<p class="mb-3">
					We only share personal information when necessary. We share with parents/guardians, school
					and community partners, service providers (contractually bound to protect data), for legal
					and safety reasons, in case of organizational changes, and for research and impact
					reporting (anonymized data only).
				</p>
				<p class="mb-3 font-semibold">We Do Not:</p>
				<ul class="list-disc list-inside space-y-2 ml-4">
					<li>Sell or rent personal information to third parties</li>
					<li>Share children's data for marketing or advertising purposes</li>
					<li>Disclose information beyond what is necessary for the intended purpose</li>
				</ul>
			</div>

			<div>
				<h3 class="font-bold text-lg mb-3">7. Will Your Data Be Processed Internationally?</h3>
				<p>
					If data must be transferred outside Nigeria, we ensure appropriate safeguards are in place
					to meet legal requirements, including obtaining parental consent when children's data is
					involved.
				</p>
			</div>

			<div>
				<h3 class="font-bold text-lg mb-3">8. Data Security</h3>
				<p>
					We implement technical and organizational measures to protect your personal data from
					unauthorized access, disclosure, alteration, or destruction. These measures include
					encryption, access controls, and regular security assessments.
				</p>
			</div>

			<div>
				<h3 class="font-bold text-lg mb-3">9. Data Retention</h3>
				<p>
					We retain personal information only for as long as necessary to fulfill the purposes
					outlined in this privacy notice, unless a longer retention period is required or permitted
					by law (such as for tax, legal, or child protection reasons). When no longer needed, we
					securely delete or anonymize your data.
				</p>
			</div>

			<div>
				<h3 class="font-bold text-lg mb-3">10. Your Data Rights</h3>
				<p class="mb-3">You have the right to:</p>
				<ul class="list-disc list-inside space-y-2 ml-4">
					<li><strong>Access:</strong> Request a copy of the personal data we hold about you</li>
					<li><strong>Correction:</strong> Request correction of inaccurate or incomplete data</li>
					<li>
						<strong>Deletion:</strong> Request data deletion when there is no legitimate reason for us
						to keep it
					</li>
					<li><strong>Restriction:</strong> Limit how we process your data</li>
					<li><strong>Objection:</strong> Object to processing based on legitimate interests</li>
					<li>
						<strong>Data Portability:</strong> Request transfer of your data to another provider where
						applicable
					</li>
					<li>
						<strong>Withdraw Consent:</strong> Where we process data based on consent, you can withdraw
						consent at any time
					</li>
				</ul>
				<p class="mt-3">
					To exercise these rights, please contact us at Info@skill2rural.org. We may require
					verification of your identity before processing your request.
				</p>
			</div>

			<div>
				<h3 class="font-bold text-lg mb-3">11. Changes to This Policy</h3>
				<p>
					We may update this Privacy Statement from time to time. Any changes will be posted on our
					intranet or communicated to you directly, along with the updated effective date. We
					encourage you to review this policy periodically.
				</p>
			</div>
		</div>
	</div>
</div>
