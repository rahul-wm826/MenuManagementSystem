import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProposalService } from '../../services/proposal.service';

@Component({
  selector: 'app-proposal-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './proposal-list.component.html',
  styleUrls: ['./proposal-list.component.css']
})
export class ProposalListComponent implements OnInit {
  proposals: any[] = [];

  constructor(private proposalService: ProposalService) { }

  ngOnInit(): void {
    this.loadProposals();
  }

  loadProposals() {
    this.proposalService.getAllProposals().subscribe(data => {
      this.proposals = data;
    });
  }
}
