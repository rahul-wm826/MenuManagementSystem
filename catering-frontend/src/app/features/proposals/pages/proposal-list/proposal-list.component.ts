import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { ProposalService } from '../../services/proposal.service';

@Component({
  selector: 'app-proposal-list',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule],
  templateUrl: './proposal-list.component.html',
  styleUrls: ['./proposal-list.scss']
})
export class ProposalListComponent implements OnInit {
  proposals = signal<any[]>([]);

  constructor(private proposalService: ProposalService) { }

  ngOnInit() {
    this.loadProposals();
  }

  loadProposals() {
    this.proposalService.getAllProposals().subscribe(data => {
      this.proposals.set(data);
    });
  }
}
