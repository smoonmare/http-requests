import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Post } from './post';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  loadedPosts = [];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.fetchPost();
  }

  onCreatePost(postData: Post) {
    // Send Http request
    this.http
    .post< {name: string} >('https://ng-http-udemy-da74d-default-rtdb.firebaseio.com/posts.json', postData)
    .subscribe(
      (res => {
        console.log(res);
    }));
  }

  onFetchPosts() {
    // Send Http request
    this.fetchPost();
  }

  onClearPosts() {
    // Send Http request
  }

  private fetchPost() {
    this.http
    .get<{ [key: string]: Post }>('https://ng-http-udemy-da74d-default-rtdb.firebaseio.com/posts.json')
    .pipe(
      map(res => {
        const postsArray: Post[] = [];
        for (const key in res) {
          if(res.hasOwnProperty(key)) {
            postsArray.push({ ...res[key], id: key});
          }
        }
        return postsArray;
      })
    )
    .subscribe(posts => {
        console.log(posts);
    });
  }
}
