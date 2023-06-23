import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Post } from './post';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private http: HttpClient) { }

  createAndStorePosts(title: string, content: string) {
    const postData: Post = {title: title, content: content};
    this.http
    .post< {name: string} >(
      'https://ng-http-udemy-da74d-default-rtdb.firebaseio.com/posts.json',
      postData
    )
    .subscribe(
      (res => {
        console.log(res);
    }));
  }

  fetchPosts() {
    return this.http
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
    );
  }
}
