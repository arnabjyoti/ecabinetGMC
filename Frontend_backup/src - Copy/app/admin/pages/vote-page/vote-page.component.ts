import { Component } from '@angular/core';


@Component({
selector: 'app-vote-page',
templateUrl: './vote-page.component.html',
styleUrls: ['./vote-page.component.css']
})
export class VotePageComponent {


issue = {
title: 'Approval of State EV Bus Procurement Policy – 2025',
description: 'Proposal to approve procurement of 200 electric buses under green mobility mission.',
attachments: [
{ name: 'Cabinet_Note.pdf' },
{ name: 'Financial_Implication.xlsx' }
]
};


members = [
{ id: 1, name: 'Chief Secretary', vote: null },
{ id: 2, name: 'Finance Secretary', vote: null },
{ id: 3, name: 'Transport Secretary', vote: null },
{ id: 4, name: 'Law Secretary', vote: null },
{ id: 5, name: 'Power Secretary', vote: null },
{ id: 6, name: 'Planning Secretary', vote: null },
{ id: 7, name: 'Environment Secretary', vote: null },
{ id: 8, name: 'Urban Development Secretary', vote: null },
{ id: 9, name: 'IT Secretary', vote: null }
];


castVote(member: any, decision: string) {
member.vote = decision;
}


get votedCount() {
return this.members.filter(m => m.vote !== null).length;
}


get result() {
const approve = this.members.filter(m => m.vote === 'Approve').length;
const reject = this.members.filter(m => m.vote === 'Reject').length;


if (this.votedCount < this.members.length) {
return 'Voting In Progress';
}
return approve > reject ? 'APPROVED' : 'REJECTED';
}
}