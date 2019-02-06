package com.aob.myfms;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.airbnb.android.react.maps.MapsPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.imagepicker.ImagePickerPackage;
import com.reactnativedocumentpicker.ReactNativeDocumentPicker;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.fabric.crashlytics.RNFirebaseCrashlyticsPackage;
import io.invertase.firebase.perf.RNFirebasePerformancePackage;
import io.invertase.firebase.analytics.RNFirebaseAnalyticsPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.christopherdro.RNPrint.RNPrintPackage;
import org.reactnative.camera.RNCameraPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.hieuvp.fingerprint.ReactNativeFingerprintScannerPackage;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new MapsPackage(),
            new RNGestureHandlerPackage(),
            new ImagePickerPackage(),
            new ReactNativeDocumentPicker(),
            new RNFirebasePackage(),
            new RNFirebaseCrashlyticsPackage(),
            new RNFirebasePerformancePackage(),
            new RNFirebaseAnalyticsPackage(),
            new SplashScreenReactPackage(),
            new RNPrintPackage(),
            new RNCameraPackage(),
            new VectorIconsPackage(),
            new ReactNativeFingerprintScannerPackage(),
            new ReactNativeConfigPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
