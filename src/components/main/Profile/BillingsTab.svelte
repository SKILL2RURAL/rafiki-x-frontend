<script lang="ts">
	import { get } from 'svelte/store';
	import downloadIcon from '$lib/assets/icons/download-gradient.png';
	import { transactions, fetchTransactions } from '$lib/stores/subscription';
	import Button from '$lib/components/ui/button/button.svelte';

	console.log($transactions);

	$effect(() => {
		if ($transactions.transactions.length === 0 && !$transactions.isLoading) {
			fetchTransactions(0);
		}
	});

	// Format date for display
	function formatDate(dateString: string | null): string {
		if (!dateString) return 'N/A';
		try {
			const date = new Date(dateString);
			return date.toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'short',
				day: 'numeric'
			});
		} catch {
			return 'N/A';
		}
	}

	// Format amount with currency
	function formatAmount(amount: number, currency: string): string {
		const symbol = currency === 'NGN' ? '₦' : '$';
		return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
	}

	// Get serial number for display (1-based)

	function handleDownloadInvoice(reference: string) {
		console.log('Download invoice for:', reference);
	}

	function handlePrevious() {
		if (!$transactions.first) {
			fetchTransactions($transactions.page - 1);
		}
	}

	function handleNext() {
		if (!$transactions.last) {
			fetchTransactions($transactions.page + 1);
		}
	}

	function refetchTransactions() {
		fetchTransactions($transactions.page);
	}
</script>

<section>
	<h2 class="text-[#253B4B] text-[20px] font-semibold mb-5">Billings</h2>

	<!-- Billing Table -->
	<div class="shadow-md rounded-[20px] overflow-hidden">
		<div class="overflow-x-auto">
			<table class="w-full border-collapse">
				<thead>
					<tr class="bg-[#F9FAFB] border-b text-[12px] font-normal text-[#667085] border-[#E8E8E8]">
						<th class="text-left py-4 px-6">S/N</th>
						<th class="text-left py-4 px-6">Payment ID</th>
						<th class="text-left py-4 px-6">Payment Date</th>
						<th class="text-left py-4 px-6">Status</th>
						<th class="text-left py-4 px-6">Amount</th>
						<th class="text-left py-4 px-6"></th>
					</tr>
				</thead>
				<tbody>
					{#if $transactions.isLoading}
						<tr>
							<td colspan="6" class="py-8 px-6 text-center text-[#808990] text-[14px]">
								Loading transactions...
							</td>
						</tr>
					{:else if $transactions.error}
						<tr>
							<td colspan="6" class="py-8 px-6 text-center text-red-500 text-[14px]">
								<p>An Error Occured</p>
								<Button
									class="my-5 bg-linear-to-r from-[#51A3DA] to-[#60269E] text-white"
									onclick={refetchTransactions}>Fetch Transactions</Button
								>
							</td>
						</tr>
					{:else if $transactions.transactions.length === 0}
						<tr>
							<td colspan="6" class="py-8 px-6 text-center text-[#808990] text-[14px]">
								No transactions found
							</td>
						</tr>
					{:else}
						{#each $transactions.transactions as record, index}
							<tr
								class="border-b border-[#E8E8E8] text-[#101828] font-normal text-[14px] hover:bg-[#F9FAFB] transition-colors"
							>
								<td class="py-4 px-6 text-[12px] md:text-[14px]">{record.id}</td>
								<td class="py-4 px-6 text-[12px] md:text-[14px]">{record.reference}</td>
								<td class="py-4 px-6 text-[12px] md:text-[14px]"
									>{formatDate(record.paidAt || record.createdAt)}</td
								>
								<td class="py-4 px-6 text-[12px] md:text-[14px]">
									<span
										class="px-2 py-1 rounded text-[12px] {record.status === 'SUCCESS'
											? 'bg-green-100 text-green-700'
											: record.status === 'PENDING'
												? 'bg-yellow-100 text-yellow-700'
												: 'bg-red-100 text-red-700'}"
									>
										{record.status}
									</span>
								</td>
								<td class="py-4 px-6 text-[12px] md:text-[14px]"
									>{formatAmount(record.amount, record.currency)}</td
								>
								<td class="py-4 px-6">
									<button
										onclick={() => handleDownloadInvoice(record.reference)}
										class="flex items-center gap-2 transition-opacity hover:opacity-80"
										disabled={record.status !== 'SUCCESS'}
									>
										<span
											class="text-[12px] md:text-[14px] bg-linear-to-r from-[#51A3DA] to-[#60269E] bg-clip-text text-transparent {record.status !==
											'SUCCESS'
												? 'opacity-50 cursor-not-allowed'
												: ''}"
										>
											Download Invoice
										</span>
										<img
											src={downloadIcon}
											alt="Download"
											class="w-4 h-4 {record.status !== 'SUCCESS' ? 'opacity-50' : ''}"
										/>
									</button>
								</td>
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>
		</div>

		<!-- Pagination -->
		{#if $transactions.transactions.length > 0}
			<div class="flex items-center justify-between px-6 py-4 border-t border-[#E8E8E8]">
				<p class="text-[#344054] text-[14px]">
					Page {$transactions.page + 1} of {$transactions.totalPages || 1}
				</p>
				<div class="flex gap-3">
					<button
						onclick={handlePrevious}
						disabled={$transactions.isLoading || $transactions.first}
						class="px-4 py-2 text-[14px] text-[#253B4B] border border-[#E8E8E8] rounded-xl hover:bg-[#F9FAFB] transition-colors disabled:opacity-50 disabled:cursor-default!"
					>
						Previous
					</button>
					<button
						onclick={handleNext}
						disabled={$transactions.last || $transactions.isLoading}
						class="px-4 py-2 text-[14px] text-[#253B4B] border border-[#E8E8E8] rounded-xl hover:bg-[#F9FAFB] transition-colors disabled:opacity-50 disabled:cursor-none!"
					>
						Next
					</button>
				</div>
			</div>
		{/if}
	</div>
</section>
