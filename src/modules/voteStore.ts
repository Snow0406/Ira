// 웨루게임잼 RE:개발살던놈들에서 사용할 투표 기능

import { Result } from "@src/types";

interface VoteData {
    maxOption: number; // 투표 선택지
    voteUsers: Map<string, number>; // userId, option
    createdAt: Date;
}

class VoteStore {
    private readonly voteData: VoteData[];

    public constructor() {
        this.voteData = [];
    }

    // 투표 생성
    public createVote(maxOption: number): number {
        const voteData: VoteData = {
            maxOption,
            voteUsers: new Map(),
            createdAt: new Date(),
        }
        this.voteData.push(voteData);
        return this.voteData.length - 1;
    }

    // 투표 하기
    public addVote(index: number, userID: string, option: number): Result {
        const vote = this.getVote(index);
        if (!vote) {
            console.log(`* addVote failed: ${index} not found`);
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
    public getVoteResult(index: number) : Result {
        const vote = this.getVote(index);
        if (!vote) {
            console.log(`* getVoteResult failed: ${index} not found`);
            return { type: false, content: [] };
        }

        const counts = new Array<number>(vote.maxOption);

         for (const [_, voteOption] of vote.voteUsers)
             counts[voteOption]++;

        counts.sort((a, b) => b - a); // 투표자가 많은것부터 나열
        return { type: false, content: counts };
    }

    // 투표 삭제하기
    public deleteVote(index: number): boolean {
        if (index < 0 || index > this.voteData.length) return false;
        this.voteData.splice(index, 1);
        return true;
    }

    // 투표 데이터 가져오기
    private getVote(index: number): VoteData | undefined {
        return this.voteData[index];
    }
}

export const voteStore = new VoteStore();