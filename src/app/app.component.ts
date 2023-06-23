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

  constructor(
    // private http: HttpClient,
    private postsService: PostsService
  ) { }

  ngOnInit(): void {
    this.isFetching = true;
    this.subscriptions.push(
      this.postsService.fetchPosts().subscribe(posts => {
        this.isFetching = false;
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
      this.postsService.fetchPosts().subscribe(posts => {
        this.isFetching = false;
      })
    )
  }

  onClearPosts() {
    // Send Http request
    this.subscriptions.push(this.postsService.deletePosts().subscribe(() => {
      this.loadedPosts = [];
    })
    );
  }
}
