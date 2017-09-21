import { Component, OnInit } from '@angular/core';
import { AuthService } from './shared/auth.service';
import { PostService } from '../shared/post.service';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
    template: `
		<div class="padded" *ngIf="auth.isAdmin | async">
			<h2><span [title]="auth.uid | async">{{auth.name | async}}</span> Supervision (<a (click)="auth.logout()">logout</a>)</h2>
			<ul>
				<li><a routerLink="upload">Upload a file</a></li>
			</ul>

			<div style="overflow:hidden;">
				<a *ngFor="let post of posts | async" [routerLink]="post.$key">
					<mat-card style="margin:0 16px 16px 0;width:300px;height:125px;float:left;">
						<img *ngIf="post.image" [src]="post.image" style="height:40px;margin:0px auto;display:block;">
						<div><strong>{{post.title}}</strong></div>
						<div>{{post.date}}</div>
					</mat-card>
				</a>
			</div>

			<div>
				<h2>New Post</h2>
				<button routerLink="new">Create</button>
			</div>


			<div>
				<h2>Manage Talks</h2>
				<select [(ngModel)]="selectedTalk">
					<option *ngFor="let talk of talkList | async" [ngValue]="talk">{{talk.title}}</option>
				</select>
				<div *ngIf="selectedTalk">
					<h3>Talk Image Upload</h3>
					<mat-form-field><input matInput [(ngModel)]="talkName"></mat-form-field>
					<image-upload [folder]="'talks/'+selectedTalk.$key"></image-upload>
				</div>
			</div>
		</div>
		<div class="padded" *ngIf="(auth.isAdmin | async) == false">
			<p>You need more access.</p>
			<button (click)="auth.login()">Login</button>
		</div>
		`,
})
export class AdminComponent {
    posts;
    talkName: string;
    talkList;
    selectedTalk;

    constructor(public auth: AuthService, public db: AngularFireDatabase) {
        this.posts = db.list('/posts').map(
            list => (<{ date: Date }[]>list).sort((a, b) => a.date >= b.date ? -1 : 1)
        );
		this.talkList = db.list('/talks/');
    }
}
