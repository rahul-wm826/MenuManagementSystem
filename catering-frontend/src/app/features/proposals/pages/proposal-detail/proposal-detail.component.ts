import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProposalService } from '../../services/proposal.service';

@Component({
  selector: 'app-proposal-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './proposal-detail.component.html',
  styleUrls: ['./proposal-detail.component.scss']
})
export class ProposalDetailComponent implements OnInit {
  proposal: any = signal({ name: 'Loading...', clientComments: [] });
  proposalId: string = '';
  publicShareLink: string = '';
  emailForm: FormGroup;
  commentForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private proposalService: ProposalService,
    private fb: FormBuilder
  ) {
    this.emailForm = this.fb.group({
      toEmail: ['', [Validators.required, Validators.email]],
      message: ['Here is the proposal we discussed.']
    });
    this.commentForm = this.fb.group({
      comment: ['', Validators.required],
      author: ['Sales Team']
    });
  }

  ngOnInit(): void {
    this.proposalId = this.route.snapshot.paramMap.get('id')!;
    this.loadProposal();
  }

  loadProposal() {
    this.proposalService.getProposalById(this.proposalId).subscribe(data => {
      this.proposal.set(data);
      this.publicShareLink = `${window.location.origin}/client-view/${this.proposal().secretToken}`;
      if (this.proposal().clientId && this.proposal().clientId.email && !this.emailForm.value.toEmail) {
        this.emailForm.patchValue({ toEmail: this.proposal().clientId.email });
      }
    });
  }

  onExport() {
    this.proposalService.exportPdf(this.proposalId, this.proposal().name).subscribe(res => {
      console.log('PDF exported');
    });
  }

  onEmailSubmit() {
    if (!this.emailForm.valid) return;
    this.proposalService.emailProposal(this.proposalId, this.emailForm.value).subscribe(res => {
      alert('Email sent successfully!');
      this.emailForm.reset({ message: 'Here is the proposal we discussed.' });
    });
  }

  onCommentSubmit() {
    if (!this.commentForm.valid) return;
    this.proposalService.addComment(this.proposalId, this.commentForm.value).subscribe(res => {
      this.commentForm.reset({ author: 'Sales Team' });
      this.loadProposal();
    });
  }
}
