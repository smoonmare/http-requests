import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs/internal/Subject';
import { map, tap } from 'rxjs/operators';
import { Post } from './post';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private postsUpdated = new Subject<Post[]>();
  private posts: Post[] = [];

  constructor(private http: HttpClient) { }

  createAndStorePosts(title: string, content: string) {
    const postData: Post = { title: title, content: content };
    this.http
      .post<{ name: string }>(
        'https://ng-http-udemy-da74d-default-rtdb.firebaseio.com/posts.json',
        postData
      )
      .subscribe(response => {
        this.posts.push(postData);
        this.postsUpdated.next([...this.posts]);
      });
  }

  fetchPosts() {
    return this.http
    .get<{ [key: string]: Post }>('https://ng-http-udemy-da74d-default-rtdb.firebaseio.com/posts.json')
    .pipe(
      map(response => {
        const postsArray: Post[] = [];
        for (const key in response) {
          if (response.hasOwnProperty(key)) {
            postsArray.push({ ...response[key], id: key });
          }
        }
        return postsArray;
      }),
      tap(posts => {
        this.posts = posts;
        this.postsUpdated.next([...this.posts]);
      })
    );
  }

  getPostsUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  deletePosts() {
    return this.http.delete('https://ng-http-udemy-da74d-default-rtdb.firebaseio.com/posts.json');
  }
}
