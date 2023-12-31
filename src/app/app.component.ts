import { Component, OnDestroy, OnInit } from '@angular/core';
import { PostsService } from './posts.service';
// import { HttpClient } from '@angular/common/http';
import { Post } from './post';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  loadedPosts: Post[] = [];
  isFetching = false;
  error = null;

  constructor(
    // private http: HttpClient,
    private postsService: PostsService
  ) { }

  ngOnInit(): void {
    this.isFetching = true;
    this.subscriptions.push(
      this.postsService.fetchPosts().subscribe({
        next: (posts) => {
          this.isFetching = false;
        },
        error: (error) => {
          this.error = `${error.statusText} - status:${error.status}`;
          this.isFetching = false;
        }
      }),
      this.postsService.error.subscribe(error => {
        this.error = error;
      })      
    );
    this.subscriptions.push(
      this.postsService.getPostsUpdateListener().subscribe(posts => {
        this.loadedPosts = posts;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  onCreatePost(postData: Post) {
    // Send Http request
    this.postsService.createAndStorePosts(postData.title, postData.content);
  }

  onFetchPosts() {
    // Send Http request
    this.isFetching = true;
    this.subscriptions.push(
      this.postsService.fetchPosts().subscribe({
        next: (posts) => {
          this.isFetching = false;
        },
        error: (error) => {
          this.error = `${error.statusText} - status:${error.status}`;
          this.isFetching = false;
        }
      })
    );
  }

  onClearPosts() {
    // Send Http request
    this.subscriptions.push(this.postsService.deletePosts().subscribe(() => {
      this.loadedPosts = [];
    })
    );
  }

  onHandleError() {
    this.error = null;
    this.onFetchPosts();
  }
}
