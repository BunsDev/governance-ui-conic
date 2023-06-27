import { useContractRead } from "wagmi"
import proxyAbi from "../assets/proxy.json"
import axios from "axios";
import { utils } from "ethers";
import { BigNumber} from "@ethersproject/bignumber";
import { Fragment, useEffect, useState } from "react";
import { Disclosure } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/20/solid'
import contractNames from "../assets/contractName.json"

const status = [{
  text: "Pending",
  className: 'text-gray-600 bg-gray-50 ring-gray-500/10',
}, {
  text: "Cancelled",
  className: 'text-yellow-800 bg-yellow-50 ring-yellow-600/20'
}, {
  text: "Executed",
  className: 'text-green-700 bg-green-50 ring-green-600/20'
}]

function getContractName(address: string) {
  return Object.keys(contractNames).map(key => {
    if ((contractNames as any)[key].indexOf(address) > -1)
      return key
   })
}

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

const recursiveBNToString = (args: any) => {
    return args.map((arg: any) =>
      BigNumber.isBigNumber(arg)
        ? arg.toString()
        : // if arg is a struct in solidity
        arg.constructor === Array
        ? recursiveBNToString(arg)
        : arg
    );
  };

const _getAllPossibleDecoded = (functionsArr: string[], calldata: string) => {
    let allPossibleDecoded = [];
    for (var i = 0; i < functionsArr.length; i++) {
      const fn = functionsArr[i];
      const _abi = [`function ${fn}`];

      const iface = new utils.Interface(_abi);
      try {
        let parsedTx = iface.parseTransaction({ data: calldata });
        allPossibleDecoded.push({
          function: fn,
          params: recursiveBNToString(parsedTx?.args),
        });
      } catch {
        continue;
      }
    }
    return allPossibleDecoded;
  };

const decodeWithSelector = async (calldata: string) => {
    // from api.openchain.xyz
    const selector = calldata.slice(0, 10);
    const response = await axios.get(
      "https://api.openchain.xyz/signature-database/v1/lookup",
      {
        params: {
          function: selector,
        },
      }
    );
    const results = response.data.result.function[selector].map((f: any) => f.name);
    if (results.length > 0) {
      // can have multiple entries with the same selector
      const allPossibleDecoded = _getAllPossibleDecoded(results, calldata);
      if (allPossibleDecoded.length > 0) {
        return allPossibleDecoded
      } else {
        return undefined
      }
    } else {
      // from 4byte.directory
      const response = await axios.get(
        "https://www.4byte.directory/api/v1/signatures/",
        {
          params: {
            hex_signature: selector,
          },
        }
      );
      const results = response.data.results.map((f: any) => f.text_signature);
      if (results.length > 0) {
        // can have multiple entries with the same selector
        const allPossibleDecoded = _getAllPossibleDecoded(results, calldata);

        if (allPossibleDecoded.length > 0) {
            return allPossibleDecoded
        } else {
          return results
        }
      } else {
        return undefined
      }
    }
  };
export default function Table () {
  const [txDecodeResult, setTxDecodeResult] = useState<any>([])
    const governanceProxy = "0xCb7c67bDde9F7aF0667E8d82bb87F1432Bd1d902"
    const {data, isError, isLoading} = useContractRead({
        address: governanceProxy,
        abi: proxyAbi,
        functionName: 'getEndedChanges'
    })

    const {data: pendingData, isError: isPendingError, isLoading: isPendingLoading} = useContractRead({
      address: governanceProxy,
      abi: proxyAbi,
      functionName: 'getPendingChanges'
  })

    useEffect(() => {
        async function recoverCalldata() {
            if (!isError && !isLoading && !isPendingError && !isPendingLoading) {
                const result = await Promise.all(([...(data as any), ...(pendingData as any)]).map(async (item: any) => Promise.all(item.calls.map(async (call:any) => {
                    return await decodeWithSelector(call.data)
                }))))
                setTxDecodeResult(result)
            }        
        }

        recoverCalldata()
    }, [isError, isLoading, data])
    console.log('dat', data, txDecodeResult)
    return <div className="bg-skin-block-bg relative col-span-1 overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="p-10 ">
         {data && (data as any).map((tx: any, index: number) => (
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button key={tx.id} className="flex w-full justify-between items-center rounded-lg px-4 py-2 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                  <div className="min-w-0">
                    <div className="flex items-start gap-x-3">
                      <p className="text-sm font-semibold leading-6 text-gray-500">{tx.id.toString()}</p>
                      <p
                        className={classNames(
                          status[tx.status].className,
                          'rounded-md whitespace-nowrap mt-0.5 px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset'
                        )}
                      >
                        {status[tx.status].text}
                      </p>
                    </div>
                    <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
                      <p className="whitespace-nowrap">
                        Created at <time dateTime={tx.requestedAt}>{new Date((Number(tx.requestedAt) * 1000)).toLocaleDateString("en-US")}</time>
                      </p>
                      <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
                        <circle cx={1} cy={1} r={1} />
                      </svg>
                      <p className="truncate">Ended at {new Date(Number(tx.endedAt) * 1000).toLocaleDateString("en-US")}</p>
                    </div>
                  </div>
                  <div className="flex flex-none items-center gap-x-4">
                  </div>
                  <ChevronUpIcon
                      className={`${
                        open ? 'rotate-180 transform' : ''
                      } h-5 w-5 text-purple-500`}
                    />
                </Disclosure.Button>
                <Disclosure.Panel>
                <table className="max-w-full divide-y divide-gray-300 table-fixed w-full">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-500 lg:table-cell"
                      >
                        Target Contract
                      </th>
                      <th
                        scope="col"
                        className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-500 lg:table-cell"
                      >
                        Contract Name
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-500">
                        Function Name
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-500">
                        Input
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-300">
                    {tx.calls.map((call: any, callIndex: number) => 
                      <tr key={tx.id}>
                        <td
                          className='hidden px-3 text-sm text-gray-500 lg:table-cell'
                        >
                          <span className="block break-words">{call.target}</span>
                        </td>
                        <td
                          className='hidden px-3 text-sm text-gray-500 lg:table-cell'
                        >
                          <span className="block break-words">{getContractName(call.target)}</span>
                        </td>
                        <td
                          className='px-3 text-sm text-gray-500'
                        >
                          {txDecodeResult.length > 0 && <span className="block break-words">{txDecodeResult[index][callIndex][0].function}</span>}
                        </td>
                        <td
                          className='px-3 py-2 text-sm text-gray-500'
                        >
                          {txDecodeResult.length > 0 && <span className="block break-words"><pre className="whitespace-pre-wrap">{JSON.stringify(txDecodeResult[index][callIndex][0].params, null, 1)}</pre></span>}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                <div className="flex justify-end mr-10">
                  <button
                    type="button"
                    disabled={tx.status === 2|| tx.status === 1 ? true: false}
                    className={classNames("rounded-md bg-gray-200 px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-25")}
                  >
                    Execute
                  </button>
                </div>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        ))}
      </div>
    </div>
}
