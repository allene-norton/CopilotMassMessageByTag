import Image from 'next/image';
import { TokenGate } from '@/components/TokenGate';
import { getSession } from '@/utils/session';
import { getTagsFields, retrieveClientsWithTag } from '@/actions/fields-message';
import { MassMessage } from '@/app/features/MassMessage';

/**
 * The revalidate property determine's the cache TTL for this page and
 * all fetches that occur within it. This value is in seconds.
 */
export const revalidate = 180;


async function Content({ searchParams }: { searchParams: SearchParams }) {
  console.log({testLog: 'testLog'})

  const data = await getSession(searchParams);
  console.log({ data });
  
  const portalUrl: string | undefined = data.workspace.portalUrl
  
  const inputToken: string | string[] | undefined = searchParams.token
  const tokenValue = typeof inputToken === 'string' ? inputToken : undefined;

  console.log({inputToken: inputToken})

  const tagsFields = await getTagsFields(tokenValue)
  console.log(tagsFields)
  // const clientData = await retrieveClientsWithTag("sampleTags","tag")
  // console.log(clientData)
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">

      <div className="flex-col mb-32 text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        <h2 className={`mb-3 text-2xl font-semibold`}>
          Mass Message Clients With Specific Tag
        </h2>
        <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
        </p>
        <MassMessage fields={tagsFields} portalUrl={portalUrl}/>
      </div>
    </main>
  );
}

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <TokenGate searchParams={searchParams}>
      <Content searchParams={searchParams} />
    </TokenGate>
  );
}
