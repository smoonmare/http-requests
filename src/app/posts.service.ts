import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from '@angular/common/http';
import { Subject } from 'rxjs/internal/Subject';
import { throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { Post } from './post';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private postsUpdated = new Subject<Post[]>();
  private posts: Post[] = [];
  error = new Subject<string>();

  constructor(private http: HttpClient) { }

  createAndStorePosts(title: string, content: string) {
    const postData: Post = { title: title, content: content };
    this.http
      .post<{ name: string }>(
        'https://ng-http-udemy-da74d-default-rtdb.firebaseio.com/posts.json',
        postData,
        { 
          // headers: new HttpHeaders(
          // {
          //   'Custom-header': 'hello world!'
          // }),
          // params: new HttpParams().set('print', 'pretty')
          observe: 'response'
        }
      )
      .subscribe({
        next: (res) => {
          this.posts.push(postData);
          this.postsUpdated.next([...this.posts]);
          console.log(res);
        },
        error: (error) => {
          this.error.next(error.statusText + error.status);
        }
      });
  }

  fetchPosts() {
    return this.http
    .get<{ [key: string]: Post }>(
      'https://ng-http-udemy-da74d-default-rtdb.firebaseio.com/posts.json',
      { 
        observe: 'response'
        // headers: new HttpHeaders(
        // {
        //   'Custom-header': 'hello world!'
        // }),
        // params: new HttpParams().set('print', 'pretty')
      }
    )
    .pipe(
      map(res => {
        const resBody = res.body;
        const postsArray: Post[] = [];
        for (const key in resBody) {
          if (resBody.hasOwnProperty(key)) {
            postsArray.push({ ...resBody[key], id: key });
          }
        }
        console.log(res);
        return postsArray;
      }),
      tap(posts => {
        this.posts = posts;
        this.postsUpdated.next([...this.posts]);
      }),
      catchError(error => {
        // Send to analytics server or any other backend work
        return throwError(() => error);
      })
    );
  }

  getPostsUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  deletePosts() {
    return this.http.delete(
      'https://ng-http-udemy-da74d-default-rtdb.firebaseio.com/posts.json',
      {
        observe: 'events'
      }
    ).pipe(tap(event => {
      if (event.type === HttpEventType.Response) {
        console.log(`event body: ${event.body}`);
      } else if (event.type === HttpEventType.Sent) {
        console.log(`event type: Sent, code: ${event.type}`);
      }
    }));
  }
}
