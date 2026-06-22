package com.ycngmn.nobook.utils.jsBridge

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.webkit.JavascriptInterface
import android.widget.Toast

class MessengerBridge(private val context: Context) {
    @JavascriptInterface
    fun openMessenger() {
        val messengerIntent = Intent(Intent.ACTION_VIEW, Uri.parse("fb-messenger://inbox")).apply {
            setPackage(MESSENGER_PACKAGE)
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }

        runCatching {
            context.startActivity(messengerIntent)
        }.onFailure {
            val launchIntent = context.packageManager
                .getLaunchIntentForPackage(MESSENGER_PACKAGE)
                ?.apply { addFlags(Intent.FLAG_ACTIVITY_NEW_TASK) }

            if (launchIntent != null) {
                runCatching {
                    context.startActivity(launchIntent)
                }.onFailure {
                    showMessengerUnavailableToast()
                }
            } else {
                showMessengerUnavailableToast()
            }
        }
    }

    private fun showMessengerUnavailableToast() {
        Toast.makeText(
            context,
            MESSENGER_UNAVAILABLE_MESSAGE,
            Toast.LENGTH_SHORT
        ).show()
    }

    private companion object {
        const val MESSENGER_PACKAGE = "com.facebook.orca"
        const val MESSENGER_UNAVAILABLE_MESSAGE = "Messenger app is not installed"
    }
}
