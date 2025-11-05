import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PublicProposalService } from '../../services/public-proposal.service';
import { ProposalService } from '../../../proposals/services/proposal.service';

@Component({
  selector: 'app-client-view',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './client-view.component.html',
  styleUrls: ['./client-view.component.css']
})
export class ClientViewComponent implements OnInit {
  proposal: any;
  token: string = '';
  commentForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private publicProposalService: PublicProposalService,
    private proposalService: ProposalService,
    private fb: FormBuilder
  ) {
    this.commentForm = this.fb.group({
      comment: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token')!;
    this.loadProposal();
  }

  loadProposal() {
    this.publicProposalService.getPublicProposal(this.token).subscribe(data => {
      this.proposal = data;
    });
  }

  onCommentSubmit() {
    if (!this.commentForm.valid) return;
    const commentData = {
      comment: this.commentForm.value.comment,
      author: 'Client'
    };
    this.proposalService.addComment(this.proposal._id, commentData).subscribe(() => {
      this.commentForm.reset();
      this.loadProposal();
    });
  }
}
