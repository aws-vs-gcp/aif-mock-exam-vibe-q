import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 text-aws-blue">
          AWS Certified AI Practitioner
        </h1>
        <h2 className="text-2xl mb-6 text-aws-orange">模擬試験</h2>
        <p className="text-lg mb-8 max-w-2xl">
          この模擬試験は、AWS Certified AI Practitioner認定試験の準備に役立つ10問の問題で構成されています。
          実際の試験形式に近い環境で練習し、あなたの知識を確認しましょう。
        </p>
        <Link href="/exam" className="aws-button text-lg px-8 py-3">
          試験を開始する
        </Link>
      </div>
      <div className="mt-12 p-6 bg-gray-50 rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold mb-4">試験の概要</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>問題数: 10問</li>
          <li>形式: 多肢選択式</li>
          <li>制限時間: なし</li>
          <li>ランダム出題: 毎回異なる順序で問題が出題されます</li>
          <li>結果表示: 試験終了後に正答率と解説が表示されます</li>
        </ul>
      </div>
    </div>
  );
}