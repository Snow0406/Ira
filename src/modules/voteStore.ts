// 웨루게임잼 RE:개발살던놈들에서 사용할 투표 기능

import { Result } from "@src/types";

interface VoteData {
    name: string;
    maxOption: number; // 투표 선택지
    voteUsers: Map<string, number>; // userId, option
    createdAt: Date;
}

class VoteStore {
    private readonly votes: Map<string,VoteData[]>;

    public constructor() {
        this.votes = new Map();
    }

    // 투표 생성
    public createVote(name: string, maxOption: number): void {
        if (!this.votes.has(name)) this.votes.set(name, []);

        const voteData: VoteData = {
            name,
            maxOption,
            voteUsers: new Map(),
            createdAt: new Date(),
        }

        const voteArray = this.votes.get(name)!;
        voteArray.push(voteData);
    }

    // 투표 하기
    public addVote(name: string, index: number, userID: string, option: number): Result {
        const vote = this.getVote(name, index);
        if (!vote) {
            console.log(`* addVote failed: ${name}/${index} not found`);
            return { type: false, content: "존재하지 않는 투표 ID 이에요 !" };
        }
        if (vote.voteUsers.has(userID))
            return { type: false, content: "이미 투표하셨어요 !" };
        if (option > vote.maxOption || option < 1)
            return { type: false, content: `잘못된 번호이에요 ! (1 ~ ${vote.maxOption} 선택 가능)` };

        vote.voteUsers.set(userID, option);
        return { type: true, content: "투표 성공 !" };
    }

    // 투표 결과 가져오기
    public getVoteResult(name: string, index: number) : Result {
        const vote = this.getVote(name, index);
        if (!vote) {
            console.log(`* getVoteResult failed: ${name}/${index} not found`);
            return { type: false, content: "없는 투표입니다." };
        }

        const counts = new Array(vote.maxOption).fill(0);

         for (const [_, voteOption] of vote.voteUsers)
             counts[voteOption - 1]++;

        // 결과 포맷팅
        const results = counts.map((count, index) => ({
            option: index + 1,
            count: count
        }));

        // 투표 수로 정렬
        results.sort((a, b) => b.count - a.count);

        // 결과 문자열 생성
        const formattedResults = results.map((item, index) =>
            `− ${index + 1}등: ${item.option}번 (${item.count}명)`
        );

        return { type: true, content: formattedResults };
    }

    // 투표 삭제하기
    public deleteVote(name: string, index: number): boolean {
        const voteArray = this.votes.get(name);
        if (!voteArray || index < 0 || index >= voteArray.length) return false;
        voteArray.splice(index, 1);
        return true;
    }

    // 투표 데이터 가져오기
    private getVote(name: string, index: number): VoteData | undefined {
        const voteArray = this.votes.get(name);
        if (!voteArray) return undefined;
        return voteArray[index];
    }
}

export const voteStore = new VoteStore();